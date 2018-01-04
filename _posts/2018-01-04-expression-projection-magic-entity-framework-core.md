---
title: Expression and Projection Magic for Entity Framework Core
date: 2018-01-04
layout: post
published: true
---

Radically upgrade your Entity Framework chops by only retrieving the columns you actually want from your database, including nested classes and even single element projections!

This is one of the more intense blog posts I've written, as getting my head around how Expressions and Projections work, especially when dealing with Entity Framework, has been an absolute mind-bender. 

In this post we're going to cover a few very important upgrades we can make to our Entity Framework linq queries, such that they produce the cleanest and most efficient SQL queries possible. In short these are:

- **Projections** - The ability to request only certain columns from the database when writing your query
- **Nested Projections** - When one projection has a property which also needs to be projected
- **Single Element Projections** - A property that isn't a collection (doesn't have .Select()) but needs to be projected anyway

Before we get started, let's look at the entities we'll be using:

Vendor                            | VendorCategory          | Fruit                 | ColourEnum
---                               | ---                     | ---                   | ---
Id (int)                          | Id (int)                | Id (int)              | Yellow = 1
Name (string)                     | CategoryName (string)   | Name (string)         | Green = 2
Category (VendorCategory) | IsImportant (bool)      | Colour (ColourEnum)   | Blue = 3
Fruits (ICollection&lt;Fruit&gt;) |||

Alright let's dive in!

## Projections  
A projection is just a way of mapping one set of properties to another. In relation to Entity Framework specifically, it's a way of translating a full entity (database table) into a C# class with a subset of those properties. The values can also be altered/joined/removed on the way through as well. Anything you can do in a SELECT statement in SQL is possible.

The simplest example of this is just the regular old `.Select()` linq statement.

    return _context.Vendors
        .Select(x => new VendorListItem()
        {
            Id = x.Id,
            Name = x.Name,
            NumberOfFruits = x.Fruits.Count
        }).ToList();

Which returns a nice bit of sql:

    SELECT [x].[Id], [x].[Name], (
        SELECT COUNT(*)
        FROM [Fruits] AS [f]
        WHERE [x].[Id] = [f].[VendorId]
    ) AS [NumberOfFruits]
    FROM [Vendors] AS [x]

Easy peasy. We're all done. Entity Framework takes care of the heavy lifting when translating projections into SQL queries. Let's knock things up a notch and take a look at how we might reuse a projection.

## Reusing Projections

Now that we've mastered the art of writing right to left assignments, let's see how we can pull that projection out on it's own.

This is where we begin to see our new friend Expressions. Here's the code:

    public class VendorListItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int NumberOfFruits { get; set; }

        public static Expression<Func<Vendor, VendorListItem>> Projection
        {
            get
            {
                return x => new VendorListItem()
                {
                    Id = x.Id,
                    Name = x.Name,
                    NumberOfFruits = x.Fruits.Count()
                };
            }
        }
    }

and to use it:

    return _context.Vendors
        .Select(VendorListItem.Projection)
        .ToList();

Now the code above is just a normal readonly property (`public int myProp {get;}`) but here we're returning an Expression. The beauty of expressions is they describe what's going on without actually executing anything. It's kind of like a blueprint, given an instance of `Vendor`, here's what I'd do to get an instance of `VendorListItem`.

Expressions are the fundamental technology that allow Entity Framework to translate linq into sql queries in the first place, because it can read the blueprint all the way down and decide how best to turn it into SQL statements.

A great example of a simple query broken down into it's expression components can be found here: https://stackoverflow.com/a/8315901/80013

![Expression Tree Example](/wp-content/uploads/2017/11/expression_tree.png)

## Nested Projections  
Now that we can easily create expressions, it's a relatively simple exercise to start nesting them.

**VERSION WARNING (EF Core 2.0.0):** At the time of writing nested collection projections only work in memory, defeating the purpose of using them in the first place. This will be fixed soon, so it's still worth understanding. They DO still work for nested single element projections which we'll learn about in the next section, so keep reading!

Let's take a look at one more level down:

    public class VendorWithFruit
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<FruitListItem> Fruits { get; set; } = new List<FruitListItem>();

        public static Expression<Func<Vendor, VendorWithFruit>> Projection
        {
            get
            {
                return x => new VendorWithFruit()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Fruits = x.Fruits.AsQueryable().Select(FruitListItem.Projection)
                };
            }
        }
    }

    public class FruitListItem
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public static Expression<Func<Fruit, FruitListItem>> Projection
        {
            get
            {
                return x => new FruitListItem()
                {
                    Id = x.Id,
                    Name = x.Name                    
                };
            }
        }
    }

Using the following query:

    // Until this is fixed, we must fetch the data into memory first
    var data = _context.Vendors
        .Include(x => x.Fruits)
        .ToList();
     
    return data.AsQueryable()
        .Select(VendorWithFruit.Projection)
        .ToList();

OK. So here you can see that we've basically just done the exact same thing with the fruit model, as we did with the vendor model. We've created a projection and used it to map some properties. The one thing that you need to do to get your nested version working is make sure you add `.AsQueryable()` to your ICollection property (`x.Fruits`), otherwise the compiler thinks your trying to perform a task on the IEnumerable.

Let's take a look at what SQL this generates:

    -- First Query
    SELECT [x].[Id], [x].[Name]
    FROM [Vendors] AS [x]
    ORDER BY [x].[Id]

    -- Second Query
    SELECT [x.Fruits].[Id], [x.Fruits].[Colour], [x.Fruits].[Name], [x.Fruits].[VendorId]
    FROM [Fruits] AS [x.Fruits]
    INNER JOIN (
        SELECT [x0].[Id]
        FROM [Vendors] AS [x0]
    ) AS [t] ON [x.Fruits].[VendorId] = [t].[Id]
    ORDER BY [t].[Id]

Now obviously this isn't ideal yet, since we get two queries instead of one, but we can control which data is sent back to our users and once the underlying EF bug is fixed, we'll have more efficient SQL too.

## Single Element Projections  
This is by far my favourite discovery of recent years. You can apply the same projection techniques above, but this time to properties that aren't collections. 

Firstly, mad props to the Entity Framework team for their tireless work getting EF Core up to speed. There's still a ways to go, but the linq query translation has been *significantly* improved. We're at the point now where the following very simple code will let you project a single element property.

    public class VendorWithCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CategoryModel Category { get; set; }

        public static Expression<Func<Vendor, VendorWithCategory>> Projection
        {
            get
            { 
                return x => new VendorWithCategory() 
                {                    
                    Id = x.Id,
                    Name = x.Name,
                    Category = CategoryModel.FromEntity(x.Category)
                }; 
            }
        }
    }

    public class CategoryModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }

        public static Expression<Func<VendorCategory, CategoryModel>> Projection
        {
            get
            {
                return x => new CategoryModel()
                {
                    Id = x.Id,
                    CategoryName = x.CategoryName
                };
            }
        }

        public static CategoryModel FromEntity(VendorCategory entity)
        {
            return Projection.Compile().Invoke(entity);
        }
    }

As you can see, the first projection class `VendorWithCategory` which is a projection of our entity `Vendor` contains a property that we also want to project: the `CategoryModel` which is a projection of `VendorCategory`. However since it's not a collection, we cant just pass our projection to a `.Select()` clause. Instead we create a new method called FromEntity that compiles and applies the projection for us.

This used to break in EF Core 1.x, so it's a huge relief to be able to post this simple code and say GET GOING! But the problem with this code, and the reason it used to break before now is that it does not get translated into SQL. Instead, Entity Framework stops walking down this expression tree and applies the projection **after the query has been executed**. This results in some nice and neat code, but it doesn't help us remove unnecessary columns from our query. Let's take a look.

Our linq query looks pretty much the same:

    return _context.Vendors
        .Include(x => x.Category)                          
        .Select(VendorWithCategory.Projection)
        .ToList();

and the resulting sql is neat and efficient:

    SELECT [x.Category].[Id], [x.Category].[CategoryName], [x.Category].[IsImportant], [x].[Id] AS [Id0], [x].[Name]
        FROM [Vendors] AS [x]
        LEFT JOIN [VendorCategories] AS [x.Category] ON [x].[CategoryId] = [x.Category].[Id]

but you can see that it added `[x.Category].[IsImportant]` which is not part of our projection. To truly improve our sql queries and have Entity Framework understand our projections **all the way down** we need the help of an Expression Visitor.

## Expression Visitor - Sources

The following code was taken from [Luke McGregor's](https://twitter.com/staticv0id) repository called [LinqExpander](https://github.com/lukemcgregor/LinqExpander) and updated to support .NET Standard 2 and Entity Framework Core 2.x async queries. It was inspired by his blog post [Composable Repositories - Nesting Extensions](http://blog.staticvoid.co.nz/2016/composable_repositories_-_nesting_extensions/) where he talks about single element projection.

You can find my updated fork of the code here: [https://github.com/bjcull/LinqExpander](https://github.com/bjcull/LinqExpander). Consider it more of an academic repository, than a working library to be distributed.

## Expression Visitor - Usage

To start with, go grab the code files from my repo above and copy them into your project. It's something like 6 files and it'll be nice to poke through them as you use them to better understand what's going on.

Next we'll update our query by applying our fancy new code to it.

Firstly, update the linq query to the following:

    return _context.Vendors
        .AsExpandable()
        .Include(x => x.Category)                          
        .Select(VendorWithCategory.Projection)
        .ToList();

The new `.AsExpandable()` lets us wrap the internal QueryProvider with our own custom one, which lets us control how we walk down the expression tree. 

Next, we'll update our single element projection class. Update the `CategoryModel` class to look like the following:

    public class CategoryModel
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }

        public static Expression<Func<VendorCategory, CategoryModel>> Projection
        {
            get
            {
                return x => new CategoryModel()
                {
                    Id = x.Id,
                    CategoryName = x.CategoryName
                };
            }
        }

        [ReplaceWithExpression(PropertyName = nameof(Projection))]
        public static CategoryModel FromEntity(VendorCategory entity)
        {
            return Projection.Compile().Invoke(entity);
        }
    }

The only thing we did here was add the `ReplaceWithExpression` attribute to the FromEntity method, and that's all we need to do. Here's the udpated and lean sql that is generated:

    SELECT [x].[Id], [x].[Name], [x].[CategoryId] AS [Id0], [x.Category].[CategoryName]
        FROM [Vendors] AS [x]
        LEFT JOIN [VendorCategories] AS [x.Category] ON [x].[CategoryId] = [x.Category].[Id]

To quickly describe what's happening here before diving into the details in the next section: When our custom QueryProvider walks down the expression tree it checks each step for the `ReplaceWithExpression` attribute. Before when it reached the `FromEntity` method Entity Framework would stop walking and return. Instead, our code replaces that node of the expression with the one referenced in the attribute. In our case, `Projection` which is an expression, and can now be walked down as well, letting Entity Framework continue to translate our linq into sql and leaving us with the most efficient translation possible.

Phew! I suggest you try this code out for yourself, it's a really great exercise! Continue reading if you'd like to know how the underlying code works in a bit more detail :)

