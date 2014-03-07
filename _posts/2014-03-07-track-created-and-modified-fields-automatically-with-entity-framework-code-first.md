---
title: Track Created and Modified fields Automatically with Entity Framework Code First
date: 2014-03-07
layout: post
published: true
---

Keep track of when your entities change automatically, by implementing a couple of quick changes.

## Add fields using a Base Entity
We'll add the `DateCreated`, `UserCreated`, `DateModified` and `UserModified` fields to each entity by creating a `BaseEntity.cs` class. Each entity that you want to contain these fields should inherit this class.

    public class BaseEntity
    {
        public DateTime? DateCreated { get; set; }
        public string UserCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public string UserModified { get; set; }
    }

For example, my `Student.cs` entity will looks like this:

    public class Student : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

## Override SaveChanges in the DbContext
In this step we'll intercept entites as they are saved and update their created and modified fields automtically. Take a look at my DbContext below:

    public class SchoolContext : DbContext
    {
        public DbSet<Student> Students { get; set; }

        public override int SaveChanges()
        {
            var entities = ChangeTracker.Entries().Where(x => x.Entity is BaseEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            var currentUsername = HttpContext.Current != null && HttpContext.Current.User != null
                ? HttpContext.Current.User.Identity.Name
                : "Anonymous";

            foreach (var entity in entities)
            {
                if (entity.State == EntityState.Added)
                {
                    ((BaseEntity)entity.Entity).DateCreated = DateTime.Now;
                    ((BaseEntity)entity.Entity).UserCreated = currentUsername;
                }

                ((BaseEntity)entity.Entity).DateModified = DateTime.Now;
                ((BaseEntity)entity.Entity).UserModified = currentUsername;
            }

            return base.SaveChanges();
        }
    }

Please Note: To track the currently logged in user, you'll need a reference to the System.Web assembly.

That's all you need. Now everytime you call SaveChanges the Created and Modified fields will automatically update.