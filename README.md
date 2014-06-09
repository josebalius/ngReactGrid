ngReactGrid - v0.5.0
===========

ngReactGrid is an Angular directive that can be used to render an enhanced HTML table or grid of data very fast using React as the rendering engine. 

The API of the grid is similar to that of ng-grid's, and the table architecture (3 tables per grid) is similar to that of jQuery DataTables.

Please refer to: http://josebalius.github.io/ngReactGrid/ for documentation.

Features
--------
* Fast, awesome performance
* Fixed headers
* Server side hooks
* Sorting
* Pagination
* Page size
* Search
* Horizontal scrolling
* Custom width / height
* Custom cell rendering
* Checkbox selection column

Todo
----
* Resizeable columns
* Column pinning
* Don't see your feature? I am accepting pull requests. Please contribute.

Develop
-------

### Developing
```bash
# Clone this repo (or your fork).
git clone https://github.com/josebalius/ngReactGrid.git
cd ngReactGrid

# Install all the the dev dependencies, Gulp, etc.
npm install
npm install -g gulp

# Run gulp inside the ngReactGrid to watch your files and build
gulp
```

You are now developing! Gulp will generate a build folder for you and put everything in there. I use examples/basic.html to implement features. It is my "sandbox" environment, so it is always changing (with whatever I'm working on)! However I still commit it because it is a good starting point for development. 

I should probably create other examples, I will when I have some time. Please remember that there is also a documentation site: http://josebalius.github.io/ngReactGrid/

Good luck!

License
----------
The MIT License (MIT)

Copyright (c) 2014 Jose Garcia

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
