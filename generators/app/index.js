'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
	prompting: function () {
		var self = this;
		var done = self.async();

		var choose = function () {
			self.log(yosay(
				'Welcome to the best ' + chalk.red('generator-restful-api') + ' generator!'
			));

			var prompts = [{
				type: 'rawlist',
				choices: ['express', 'restify', 'koa'],
				name: 'framework',
				message: 'Which framework do you want to use?',
				default: 'koa'
			}];

			self.prompt(prompts, function (props) {
				self.props = props;

				done();
			}.bind(self));
		};

		if (!this.fs.exists(this.destinationPath('package.json'))) {
			this.log(chalk.blue("Please init npm package first!"));

			this.spawnCommand("npm", ["init"]).on('close', choose);
		} else {
			choose();
		}

	},

	writing: function () {
		var self = this;
		this.fs.copy(
			this.templatePath(),
			this.destinationPath()
		);

		['routers', 'test/routers', 'test/utils'].forEach(function (dir) {
			mkdirp(dir);
			self.log(chalk.yellow("create") + " " + dir);
		});

		this.fs.copyTpl(
			this.templatePath('app.js'),
			this.destinationPath('app.js'),
			{
				framework: this.props.framework,
				creation: this.props.framework == 'restify' ? '.createServer()' : '()'
			}
		);
	},

	install: function () {
		this.log(chalk.blue("Installing " + this.props.framework));
		this.npmInstall(this.props.framework, {save: true});
	}
});
