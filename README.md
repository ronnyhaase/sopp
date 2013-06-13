# sopp
**S**avage **Op**tion **P**arser

1. ```npm install sopp```

2. ```var sopp = require('sopp');```

3. A example that should explain everything:

```
var options = [
	{ name: 'help', short: 'h?', long: '--help', type: Boolean }
	, { name: 'version', short: 'v', long: '--version', type: Boolean }
	, { name: 'name', short: 'n', long: '--name', type: String }
	, { name; 'friends', short: 'f', long: '--friend', type: Array}
];

var parsed_options = sopp(options);
```

Now let's imagine this call of your cool node CLI app using **sopp**:
```mycoolapp anyfile.ext -hvnPeter --friend=Paul -fMarry -f Bob -x --foo anyfile2.ext anyfile3.ext```

Then ```parsed_options``` will be:
```
{
	illegal_: ['--foo', '-x'],
	files_: ['anyfile.ext', 'anyfile2.ext', 'anyfile3.ext'],
	help: true,
	version: true,
	name: 'Peter',
	friends: ['Paul', 'Marry', 'Bob']
}
```

As you may already noticed, **sopp** does:
* Accept multiple characters for one option in `short`, as seen in the help option
* Put every illegal option into `illegal_`
* Every argument that's not a short-hand or long-hand option is considered a file and put into `files_` (Simply ignore it if it's of no use for you)
* It's possible to put multiple boolean options into one short-hand argument
* If a option is of type String or Array, and found in a short-hand argument, the rest of the argument is considered a value.
* If that option is the last character in the argument, the next argument is considered the value
* Everything else should be clear, else ask me

### (Don't worry this documentation will get extended and improved, soon)
