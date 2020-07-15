const fs = require('fs');
const path = require('path');
const glob = require('glob');

const borderedStyle = {
	border: '1px solid #e8e8e8',
	borderRadius: 3,
	padding: 16,
};

const exercises = glob.sync(`${path.join(__dirname, `src/exercises`)}/*`);

// Prepare Markdown file to use as final result:
// 1. Remove ```js ... ``` markers from Markdown
// 2. Replace <></> with a <div /> that looks like a Styleguidist example,
//    but without an editor
const markdownToCodeExample = (s) =>
	s
		.replace(/^```\w*$/gm, '')
		.replace(/<>/, `<div style={${JSON.stringify(borderedStyle)}}>`)
		.replace(/<\/>/, `</div>`);

const config = {
	serverPort: 6061,
	title: 'Resilient component libraries in React',
	styleguideDir: 'public/styleguide',
	assetsDir: 'static',
	// Read examples from Component.md files only, not from Readme.md
	getExampleFilename: (x) => x.replace(/\.js$/, '.md'),
	skipComponentsWithoutExample: true,
	pagePerSection: true,
	exampleMode: 'expand',
	usageMode: 'expand',
	styles: {
		StyleGuide: {
			'@global img': {
				maxWidth: '100%',
			},
		},
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules/,
					options: {
						presets: [
							[
								'@babel/env',
								{
									modules: false,
								},
							],
							'@babel/react',
						],
					},
				},
			],
		},
	},
	updateExample(props, exampleFilePath) {
		const { settings, lang } = props;
		if (settings && typeof settings.file === 'string') {
			const filepath = path.resolve(
				path.dirname(exampleFilePath),
				settings.file
			);
			const { file, ...restSettings } = settings;
			const rawContent = fs.readFileSync(filepath, 'utf8');
			const content =
				filepath.endsWith('.md') && lang === 'jsx'
					? markdownToCodeExample(rawContent)
					: rawContent;
			return {
				content,
				settings: restSettings,
				lang,
			};
		}
		return props;
	},
	// Generate sections for all exercises
	sections: exercises.map((folder) => ({
		name: path
			.basename(folder)
			.replace(/^(\d+)-/, '$1. ')
			.replace(/_/g, ' '),
		sectionDepth: 1,
		sections: [
			{
				name: 'Task',
				content: `${folder}/Readme.md`,
			},
			{
				name: 'Exercises',
				components: `${folder}/*.js`,
			},
		],
	})),
};

module.exports = config;
