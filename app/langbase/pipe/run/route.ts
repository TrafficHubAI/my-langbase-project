import {Langbase} from 'langbase';
import {NextRequest} from 'next/server';

export async function POST(req: NextRequest) {
	const {prompt} = await req.json();

	// 1. Initiate the Pipe.
	const langbase = new Langbase({
		apiKey: process.env.LANGBASE_API_KEY!,
	});

	// 2. Generate a text by asking a question
	const result = await langbase.pipes.run({
		messages: [{role: 'user', content: prompt}],
		name: 'cold-email-gpt',
		stream: false,
	});

	// 3. Done, return the stream in a readable stream format.
	return new Response(JSON.stringify(result));
}
