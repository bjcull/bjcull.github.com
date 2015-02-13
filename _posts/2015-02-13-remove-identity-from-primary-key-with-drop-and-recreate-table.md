---
title: Remove Identity from Primary Key with Drop and Recreate Table
date: 2015-02-13
layout: post
published: true
---

If you want to remove the Identity from a Primary Key, you're going to need to Drop and Recreate the table and any associated Foreign Keys along with it. Here's a quick to guide to getting the job done.

## The Final Script
Start with the answer hey? Here is a script I used to remove the identity from a reference table `AccountingSystems` that shouldn't of had one in the first place. I'll break down the steps below.

    BEGIN TRANSACTION -- For practicing without changing the database

	    -- Step 1: Create new table
        CREATE TABLE [dbo].[AccountingSystemsNew](
	        [ID] [bigint] PRIMARY KEY NOT NULL,
	        [SystemName] [nvarchar](100) NOT NULL,
	        [CreationDate] [datetime] NOT NULL,
	        [ApplicationCredentials] [xml] NULL,
        )

	    -- Step 2: Copy over the data
        INSERT INTO [AccountingSystemsNew]
        SELECT * FROM [AccountingSystems]

	    -- Step 3: Drop any associated foreign keys
        ALTER TABLE [Clients] DROP CONSTRAINT [FK__Clients__Account__74AE54BC]
        ALTER TABLE [AccountingSyncHistory] DROP CONSTRAINT [FK__Accountin__Accou__6E01572D]
        ALTER TABLE [Invoices] DROP CONSTRAINT [FK__Invoices__Accoun__36B12243]
        ALTER TABLE [StagingHeader] DROP CONSTRAINT [FK__StagingHe__Accou__07C12930]
	
	    -- Step 4: Drop the old table
        DROP TABLE [AccountingSystems]

	    -- Step 5: Rename the new table back to the old table name
        EXEC sp_rename [AccountingSystemsNew], [AccountingSystems]

	    -- Step 6: Recreate the associated foreign keys
        ALTER TABLE [Clients] ADD CONSTRAINT [FK__Clients__Account__74AE54BC] FOREIGN KEY ( AccountingSystemID ) REFERENCES AccountingSystems(ID)
        ALTER TABLE [AccountingSyncHistory] ADD CONSTRAINT [FK__Accountin__Accou__6E01572D] FOREIGN KEY ( AccountingSystemID ) REFERENCES AccountingSystems(ID)
        ALTER TABLE [Invoices] ADD CONSTRAINT [FK__Invoices__Accoun__36B12243] FOREIGN KEY ( AccountingSystemID ) REFERENCES AccountingSystems(ID)
        ALTER TABLE [StagingHeader] ADD CONSTRAINT [FK__StagingHe__Accou__07C12930] FOREIGN KEY ( AccountingSystemID ) REFERENCES AccountingSystems(ID)

    ROLLBACK TRANSACTION -- For practicing without changing the database

## Step 1: Create new table
This is just an exact copy of your existing table with the identity removed. I just went to management studio, scripted out the table and removed the verbose primary key definition, and replaced it with the simpler syntax you see above `PRIMARY KEY NOT NULL`.

## Step 2: Copy over the data
Not much effort here, just make sure you don't lose any data.

## Step 3: Drop any associated foreign keys
This was the hard one. First you need to go find your keys, then you need to make sure that they have the same name in each of your environments.

I used the handy `EXEC sp_fkeys 'AccountingSystems'` to find my foreign keys.

**WARNING: Your foreign key names may be different between production and your local machine.** 

## Step 4: Drop the old table
Simple, good bye old table!

## Step 5: Rename the new table
We want our new table to slot back nicely into where the old table once was. MSSQL gives you `sp_rename` to get the job done.

## Step 6: Recreate the foreign keys
Similar syntax to dropping the keys, be sure to double check that your column names are correct.


That's all there is to it. Be sure to check out technologies like [Entity Framework's Code First Migrations](https://msdn.microsoft.com/en-us/data/jj591621.aspx), which does a great job of abstracting this kind of work from us.