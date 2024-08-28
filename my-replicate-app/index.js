import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'adirik/flux-cinestill:216a43b9975de9768114644bbf8cd0cba54a923c6d0f65adceaccfc9383a938f'
const input = {
  model: 'dev',
  prompt: 'CNSTLL, Road trip, view through car window of desert highway\n',
  lora_scale: 0.6,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  guidance_scale: 3.5,
  output_quality: 80,
  extra_lora_scale: 0.8,
  num_inference_steps: 28,
}

console.log('Using model: %s', model)
console.log('With input: %O', input)

console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
