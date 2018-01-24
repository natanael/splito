[ALPHA] working, but not ready

# splito

Save-execute editor for multiple file editing

# Concept

Edit a file named `ghostfile.js` with the content:

```javascript
☢ exec "find src"
☢ load "src"
☢ pick "./package.json"
```

And everytime you save every line starting with `☢` should be executed.
All lines between statements are part of the statement above.
The example code above will execute to:

```javascript
☢ SUCCESS exec "find src"
src/
src/index.js
☢ SUCCESS load "src/*.js"
☢ pick "src/index.js"
☢ file "./package.json"
{
  ...<content of package.json>..
}
```

Now any changes you make to the content of `☢ file "./package.json"` will be replicated to `package.json`.
Soon it will be vice-versa

# existing commands

## exec `☢ exec <command>`

Will execute the command and add the `stdout` as lines below.

## load `☢ load "<glob>"`

Will find all files mathing the glob and add the lines as: `☢ pick "<filepath>"`

## pick `☢ pick "<filepath>"`

Will load the contents of a file under a `☢ file "<filepath>"`

## file `☢ file "<filepath>"`

Will replicate any changes to the lines below into the specified file

# current limitations

* Some update events are being ignored by chokidar.
* Still not applying listeners to `☢ file`
