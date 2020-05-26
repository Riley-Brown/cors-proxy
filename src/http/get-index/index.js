const fetch = require('node-fetch');
const FileType = require('file-type');
const sharp = require('sharp');

exports.handler = async function http(req) {
  const url = req.queryStringParameters.url;

  try {
    const getUrl = await fetch(url);
    const imgBuffer = await getUrl.buffer();

    const fileType = await FileType.fromBuffer(imgBuffer);

    const resized = sharp(imgBuffer)
      .resize({
        width: 512,
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFormat('jpeg');

    const resizedBuffer = await resized.toBuffer();

    if (getUrl.status !== 200) {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ err: 'Something went wrong getting image data' })
      };
    }

    if (fileType && fileType.mime.includes('image') && resizedBuffer) {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ imgBuffer: resizedBuffer })
      };
    } else {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          err: 'Invalid image type'
        })
      };
    }
  } catch (err) {
    console.log(err);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ err: 'Something went wrong getting image data' })
    };
  }
};
