hijs
====

> hijs is a dead-simple syntax highlighter for JavaScript code on the browser.

By default, it highlights everything inside `<code>` blocks.

If you have command-line snippets, such as:

    $ ls -l > /dev/null

it will skip those, cause they ain't no JavaScript.

usage
-----

    <script src="hijs.js"></script>

example
-------

Code extract from http-console:

![screenshot](http://files.droplr.com.s3.amazonaws.com/files/36156834/1bgj3c.Screen%20shot%202010-06-12%20at%2016:43:02.png)

philosophy
----------

hijs is a simple solution to a potentially complicated problem. It won't
fit all your needs, but if what you're trying to achieve is simple enough,
hijs might be the tool for you.

styling
-------

hijs wraps tokens in `<span>` tags. You can style them like so:

    code .keyword              { font-weight: bold }
    code .string, code .regexp { color: green }
    code .class, code .special { color: blue }
    code .number               { color: pink }
    code .comment              { color: grey }

more info
---------

**RTFC**

