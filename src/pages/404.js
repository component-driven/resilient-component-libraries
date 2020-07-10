import React from 'react';
import { Link } from 'gatsby';

export default function Page404() {
	return (
		<main style={{ padding: '1rem' }}>
			<h1>Page not found ;—(</h1>
			<p>
				Try to start from the <Link to="/">home page</Link>
			</p>
		</main>
	);
}
