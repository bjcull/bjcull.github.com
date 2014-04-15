---
title: Move Shelveset to a Different Branch in TFS
date: 2014-04-15
layout: post
published: true
---

Want to move a shelveset to a different branch? It's more painful than I realised, but not to worry, here's exactly what you need to do.

## Step 1: Preparation

Make sure your source branch and target branch are both up to date by running Get Latest Changes. If you don't you may receive the error: 

**"Unable to determine the workspace."**

Make sure you've created your shelveset and there are no pending changes for either branch. This includes the changes you just shelved! If you don't you may receive the error: 

**"An item with the same key has already been added"**


## Step 2: Open Command Prompt

Open up a visual studio command prompt. I used "VS2013 x64 Cross Tools Command Prompt", very inconveniently located in `C:\Program Files (x86)\Microsoft Visual Studio 12.0\Common7\Tools\Shortcuts`.

Make sure you navigate to the root of (or anywhere inside) your project, or you might see this friendly guy again: **"Unable to determine the workspace."**

![Empty Command Prompt](/wp-content/uploads/2014/04/Blog-Shelveset-Empty-Command-Prompt.png)  
*Figure: Command prompt open and navigated to project*

## Step 3: Run this Command
Now run the following Command: `tfpt unshelve /migrate /source:"$/ProjectName/Branch" /target:"$/ProjectName/Targetbranch" "My Shelveset Name"`

![Command Prompt with Command](/wp-content/uploads/2014/04/Blog-Shelveset-Prompt-with-Command.png)  
*Figure: Running the command using my project's values*


## Step 4: Follow the Prompts

Now that you've run the command, a couple of prompts will appear. They should be quite straight forward.

![First Prompt](/wp-content/uploads/2014/04/Blog-Shelveset-Popup.png)  
*Figure: The first prompt. I just clicked "Unshelv".*


![Second Prompt](/wp-content/uploads/2014/04/Blog-Shelveset-Popup-2.png)  
*Figure: The second prompt. Here I clicked "Auto-merg" and then once completed, "Close".*


After you've closed the final prompt, your original command window should look something like this:

![Command Complete](/wp-content/uploads/2014/04/Blog-Shelveset-Prompt-with-Success.png)  
*Figure: You're all done. Close this when you're ready.*


That's it. You should see the changes from your shelveset now applied to the target branch, ready to be checked in.
