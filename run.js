#!/usr/bin/env node

const pm2 = require('pm2');
var args = require('yargs').argv;
let appPath = args.app || './';
let online = args._.indexOf('online') > -1?' online':'';
pm2.connect(function(err) {
	pm2.start({
		watch: [appPath],
		ignore_watch: ['.nuxt', 'pages', 'node_modules'],
		script    : `${__dirname}/index.js`,     // Script to be run
		exec_mode : 'cluster',       // Allows your app to be clustered
		instances : 1, // Optional: Scales your app by 4
		args: `${appPath}${online}`,           
		max_memory_restart : '100M' // Optional: Restarts your app if it reaches 100Mo

	},function(err, apps) {
		pm2.disconnect();   // Disconnects from PM2
		var spawn = require('child_process').spawn;
		free = spawn('pm2', ['logs'],  { stdio: 'inherit' }); 

		// 捕获标准输出并将其打印到控制台 
		free.stdout && free.stdout.on('data', function (data) { 
			console.log(data.toString()); 
		}); 

		// 捕获标准错误输出并将其打印到控制台 
		free.stderr && free.stderr.on('data', function (data) { 
			// console.log(data.toString()); 
		}); 

		// 注册子进程关闭事件 
		free.on('exit', function (code, signal) { 
			console.log(code); 
		});
		if (err) throw err
	});
});