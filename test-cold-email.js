// Test script for cold-email-gpt pipe
async function testColdEmailPipe() {
  try {
    console.log('Testing cold-email-gpt pipe...\n');
    
    // Test the streaming endpoint
    const streamResponse = await fetch('http://localhost:3000/langbase/pipe/run-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Please write a cold email with the following details:
- Recipient's name: Sarah Johnson, CTO at TechStart Inc.
- Sender's name: John Smith, Head of Sales at CloudSync Solutions
- Purpose: Introduce our project management SaaS that helps tech startups
- Value proposition: 40% faster project delivery with AI-powered task prioritization
- Personalization: TechStart recently raised Series A funding`
          }
        ]
      }),
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      throw new Error(`HTTP error! status: ${streamResponse.status}, message: ${errorText}`);
    }

    // Get the thread ID from headers
    const threadId = streamResponse.headers.get('lb-thread-id');
    console.log('Thread ID:', threadId);
    console.log('\nStreaming Response:');
    console.log('-------------------');

    // Read the streaming response
    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    console.log('\n\n-------------------');
    console.log('Stream completed!');

    // Also test the non-streaming endpoint
    console.log('\n\nTesting non-streaming endpoint...');
    const response = await fetch('http://localhost:3000/langbase/pipe/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Write a brief cold email for a web design agency reaching out to a local restaurant owner named Maria about redesigning their website'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('\nNon-streaming Response:');
    console.log('----------------------');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
}

// Wait a bit for the server to start, then run the test
console.log('Make sure your Next.js server is running on http://localhost:3000');
console.log('Starting test in 3 seconds...\n');
setTimeout(() => {
  testColdEmailPipe();
}, 3000); 