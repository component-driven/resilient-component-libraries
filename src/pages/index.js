import React from 'react';
import {
	DialogProvider,
	useDialog,
} from '../exercises/5-Context/final/DialogProvider';

function PromptExample() {
	const [name, setName] = React.useState('');
	const { prompt } = useDialog();

	return (
		<main
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				width: '100%',
			}}
		>
			<p>
				<b>Name:</b> {name || 'Incognito'}
			</p>
			<button
				onClick={async () => {
					const name = await prompt({
						title: 'The universe asks',
						message: 'What’s your name, yo?',
						defaultValue: 'Incognito',
					});
					setName(name);
				}}
			>
				Ask name
			</button>
		</main>
	);
}

export default () => (
	<>
		<DialogProvider>
			<PromptExample />
		</DialogProvider>
	</>
);
