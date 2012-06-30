---
title: How to use SQL Server Encryption with Symmetric Keys
date: 2010-05-11
layout: post
categories:
- Database
tags:
- encryption
- sql
---

<p>You can quickly and securely encrypt data in SQL Server 2005+ by using the native Symmetric Keys functionality. The most common encryption algorithms symmetric key encryption supports are Des, Triple Des, RC4 128bit, AES 128bit and AES 256bit.</p>  <h2>Setup your database</h2>  <p>To create a symmetric key, we first need to setup our database with a master key and a certificate, which act as protectors of our symmetric key store.</p>  <p><strong>Create a Database Master Key</strong></p>  <pre class="brush: sql;">CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'myStrongPassword'</pre>

<p><strong>Create a Certificate</strong></p>

<pre class="brush: sql;">CREATE CERTIFICATE MyCertificateName
WITH SUBJECT = 'A label for this certificate'</pre>

<h2>Create your Symmetric Key</h2>

<p>Now that we have setup our database, we can add the symmetric key to our certificate. To ensure we can replicate the key on another server, or rebuild the key if it is corrupted, you must very safely keep note of the KEY_SOURCE and IDENTITY_VALUE parameters, as these are what is used to create the key.</p>

<p><strong>Create a Symmetric Key</strong></p>

<pre class="brush: sql;">CREATE SYMMETRIC KEY MySymmetricKeyName WITH
IDENTITY_VALUE = 'a fairly secure name',
ALGORITHM = AES_256,
KEY_SOURCE = 'a very secure strong password or phrase'
ENCRYPTION BY CERTIFICATE MyCertificateName;</pre>

<p>The IDENTITY_VALUE parameter is used to generate the guid for the key and the KEY_SOURCE is used to generate the actual key. This allows you to run the above code on any server as many times as you like, <em>with the same values</em>, to generate the exact same key.</p>

<p>I’ve chosen AES_256, but you can choose from the following encryption algorithms: DES, TRIPLE_DES, RC2, RC4, RC4_128, DESX, AES_128, AES_192, and AES_256.</p>

<h2>Encrypting and Decrypting Data</h2>

<p>Finally, we can encrypt and decrypt data using the key we have just created by using the following snippets of code.</p>

<p><strong>Open the Key</strong></p>

<p>Before you can start encrypting or decrypting data, you must first initialize the key. This is done with the following piece of code.</p>

<pre class="brush: sql;">OPEN SYMMETRIC KEY MySymmetricKeyName
DECRYPTION BY CERTIFICATE MyCertificateName</pre>

<p><strong>Encrypting data</strong></p>

<p>You can encrypt data by using the EncryptByKey function, like so:</p>

<pre class="brush: sql;"><p>DECLARE @Result varbinary(256) <p>SET @Result = EncryptByKey(Key_GUID('MySymmetricKeyName'), @ValueToEncrypt) <p>&#160;</p></pre>

<p>Note that the result of the above encryption is of type varbinary(256), and if you would like to store the value in a column to use this type.</p>

<p><strong>Decrypting Data</strong></p>

<p>You can decrypt data by using the DecryptByKey function, like so:</p>

<pre class="brush: sql;">DECLARE @Result varchar(max)
SET @Result = DecryptByKey(@ValueToDecrypt)</pre>

<p>Make sure you decrypt to the same type that you encrypted in the first place. In my example I encrypted a varchar(max), so I also decrypted to a varchar(max).</p>

<h2>Using Symmetric Keys in a Function</h2>

<p>Because symmetric keys use time based sessions, you cannot open them inside a function, however you can get around this by opening them first with a Stored Procedure, and then calling the function. Here’s an Example of the setup I have going.</p>

<p><strong>The OpenKeys Stored Procedure</strong></p>

<pre class="brush: sql;">CREATE PROCEDURE OpenKeys
AS
BEGIN
    SET NOCCOUNT ON;

    BEGIN TRY
        OPEN SYMMETRIC KEY MySymmetricKeyName
        DECRYPTION BY CERTIFICATE MyCertificateName
    END TRY
    BEGIN CATCH
        -- Handle non-existant key here
    END CATCH
END</pre>

<p><strong>The Encrypt Function</strong></p>

<pre class="brush: sql;">CREATE FUNCTION Encrypt
(
    @ValueToEncrypt varchar(max)
)
RETURNS varbinary(256)
AS
BEGIN
    -- Declare the return variable here
    DECLARE @Result varbinary(256)

    SET @Result = EncryptByKey(Key_GUID('MySymmetricKeyName'), @ValueToEncrypt)

    -- Return the result of the function
    RETURN @Result
END</pre>

<p><strong>The Decrypt Function</strong></p>

<pre class="brush: sql;">CREATE FUNCTION Decrypt
(
    @ValueToDecrypt varbinary(256)
)
RETURNS varchar(max)
AS
BEGIN
    -- Declare the return variable here
    DECLARE @Result varchar(max)

    SET @Result = DecryptByKey(@ValueToDecrypt)

    -- Return the result of the function
    RETURN @Result
END</pre>

<p><strong>An Example of How to Use Symmetric Keys in a Function</strong></p>

<pre class="brush: sql;">EXEC OpenKeys

-- Encrypting
SELECT Encrypt(myColumn) FROM myTable

-- Decrypting
SELECT Decrypt(myColumn) FROM myTable</pre>

<p>As long as you call the OpenKeys stored procedure in the same query as the function, it will work.</p>