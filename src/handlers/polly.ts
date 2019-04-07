import { APIGatewayProxyHandler } from 'aws-lambda';
import { Polly } from 'aws-sdk';

export const postSynthesize: APIGatewayProxyHandler = async (event) => {
  const body = event.body || '{}';
  let { text, voiceId } = JSON.parse(body);
  voiceId = voiceId || 'Nicole';
  const params = {
    OutputFormat: 'mp3',
    Text: text,
    VoiceId: voiceId,
    TextType: 'text',
  };
  const polly = new Polly();
  const data = await polly.synthesizeSpeech(params).promise();
  const stream:any = data.AudioStream;
  return {
    statusCode: 200,
    body: stream.toString('base64'),
    headers: {
      'content-type': 'audio/mpeg'
    },
    isBase64Encoded: true
  };
}

export const getVoices: APIGatewayProxyHandler = async () => {
  const polly = new Polly();
  const data = await polly.describeVoices().promise();
  return {
    statusCode: 200,
    body: JSON.stringify(data.Voices),
    headers: {
      'content-type': 'application/json'
    },
  };
}



