const fetch = require('node-fetch');
const FileType = require('file-type');

exports.handler = async function http(req) {
  const url = req.queryStringParameters.url;

  try {
    const getUrl = await fetch(url);
    const imgBuffer = await getUrl.buffer();

    const fileType = await FileType.fromBuffer(imgBuffer);

    console.log(fileType);

    if (getUrl.status === 200) {
      if (fileType && fileType.mime.includes('image') && imgBuffer) {
        return {
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ imgBuffer })
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
    } else {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ err: 'Something went wrong getting image data' })
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
