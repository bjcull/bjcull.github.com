---
title: Why Angular-CLI Creates a Shared Index.ts - Barrel Modules 
date: 2016-07-05
layout: post
published: true
---

Ever wonder why the angular-cli creates those index.ts files and shared folders? They're called barrels and they make life a little nicer.

## What is a Barrel?  
A barrel is a way of wrapping up a bunch of modules into a single module that the rest of your application can reference instead. It helps consolidate your imports into something a lot more readable. 

It's how you turn this:

    import {TransfersComponent} from './transfers/transfers.component';
    import {TransfersService} from './transfers/transfers.service';
    import {TransferDetailComponent} from './transfers/transfer-detail.component';


Into this:

    import { TransfersComponent, TransfersService, TransferDetailComponent } from './transfers';


## Create a Barrel manually  
Let's take a look at an example from a real application of mine.

**\src\app\app.component.ts**

    import {HeaderComponent} from './header/header.component';
    import {SidebarComponent} from './sidebar/sidebar.component';
    import {PayersComponent} from './payers/payers.component';
    import {PayerDetailComponent} from './payers/payer-detail.component';
    import {PayersService} from './payers/payers.service';
    import {PaymentsService} from './payments/payments.service';
    import {UserSettingsComponent} from './profile/user-settings.component';
    import {MerchantSettingsComponent} from './profile/merchant-settings.component';
    import {ApiKeysComponent} from './profile/api-keys.component';
    import {AuthenticatedHttpService} from './auth/authenticated-http.service';
    import {UserService} from './profile/user.service';
    import {PaymentsComponent} from './payments/payments.component';
    import {TransfersComponent} from './transfers/transfers.component';
    import {TransfersService} from './transfers/transfers.service';
    import {TransferDetailComponent} from './transfers/transfer-detail.component';
 

Here you can see that my app component references a whole bunch of my applications components individually. We want to reduce the number of imports. Let's start by focussing in on just the transfers feature, which is the last three lines from above.

![Transfers](/wp-content/uploads/2016/07/transfers-solution-explorer.png)  
**Figure: Transfers feature in Solution Explorer**

I'm already grouping my components by feature as per the [angular style guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#04-08) so all of my transfers components are in the transfers folder. This is important because we are going to export all the components in this folder.

To add our Barrel, we simply add an `index.ts` to the folder.

![New Transfers Barrel](/wp-content/uploads/2016/07/new-transfers-barrel.png)  
**Figure: Now with added index.ts**

**\src\app\transfers\index.ts**

    export * from './transfers.service';
    export * from './transfer-detail.component';
    export * from './transfers.component';


We then fill it with everything we want to export. Once this is done we can update our original app.component with a consolidated version of our imports. Here's what it looks like once I added barrels to each component.

**\src\app\app.component.ts**

    import {HeaderComponent} from './header/header.component';
    import {SidebarComponent} from './sidebar/sidebar.component';
    import {PayersComponent, PayerDetailComponent, PayerDetailComponent} from './payers';
    import {UserSettingsComponent, MerchantSettingsComponent, ApiKeysComponent, UserService} from './profile';
    import {AuthenticatedHttpService} from './auth';
    import {PaymentsService, PaymentsComponent} from './payments';
    import {TransfersComponent, TransfersService, TransferDetailComponent} from './transfers';


## What about the shared folder?  
The shared folder takes the concept one step futher by consolidating all of the shared resources within an individual feature. Let's use the transfers feature again as an example.

We use the `transfers.service.ts` service in both of our transfers components, referenced like so:

    import {ITransfer, TransfersService} from './transfers.service';
 

As per the [style guide for shared resources](https://angular.io/docs/ts/latest/guide/style-guide.html#!#04-07) we should put our service (and any other shared resources) into a shared folder. Let's update our folder structure now.

![Shared Folder Structure](/wp-content/uploads/2016/07/shared-folder-structure.png)  
**Figure: Added shared folder and another barrel**

Here I've moved the service into the shared folder and I've also separated out my models into their own file to reduce clutter in my service file. I've also added a barrel to the shared folder as well. Let's look at the code.

**\src\app\transfers\shared\index.ts**

    export * from './transfers.service';
    export * from './transfers.models';


Now in my transfer component I can import any shared resource by using:

**\src\app\transfers\transfers.component.ts**

    import {ITransfer, ITransferDetails, TransfersService} from './shared';


The only remaining thing to do is update our transfers barrel from:

**\src\app\transfers\index.ts**

    export * from './transfers.service';
    export * from './transfer-detail.component';
    export * from './transfers.component';
 

to:

    export * from './shared';
    export * from './transfer-detail.component';
    export * from './transfers.component';


Don't worry, the top level app.component imports remain the same.

## Further reading  
I highly encourage you to take a look at the [Angular Styleguide](https://angular.io/docs/ts/latest/guide/style-guide.html) as there are a number of great tips for structuring your angular 2 application.

I also recommend you take a look at this stackoverflow answer for a [super quick summary](http://stackoverflow.com/a/37688570/80013).

Lastly, consider taking a look at the [Angular 2 Bootcamp](https://firebootcamp.com/angular2/) my current company runs. Ask for me as a mentor, it will be fun :)
