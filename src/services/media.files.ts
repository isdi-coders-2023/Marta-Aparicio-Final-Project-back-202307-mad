/* eslint-disable camelcase */
import cloudinaryBase from 'cloudinary';
import createDebug from 'debug';
import { CloudinaryError, HttpError } from '../types/http.error.js';
import { ImgData } from '../types/image.js';

const debug = createDebug('Proyecto-final:Services:MediaFiles');

export class CloudinaryService {
  private cloudinary: typeof cloudinaryBase.v2;
  constructor() {
    this.cloudinary = cloudinaryBase.v2;
    this.cloudinary.config({
      secure: true,
    });
    debug('Instantiated');
    debug('key:', this.cloudinary.config().api_key);
  }

  async uploadImage(imagePath: string) {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      const result = await this.cloudinary.uploader.upload(imagePath, options);
      debug(result);
      const imageData: ImgData = {
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        url: result.url,
      };
      return imageData;
    } catch (error) {
      const httpError = new HttpError(
        406,
        'Not Acceptable',
        (error as CloudinaryError).error.message
      );
      throw httpError;
    }
  }

  resizeImage(imageData: ImgData) {
    return this.cloudinary.url(imageData.publicId, {
      transformation: {
        width: 200,
        crop: 'scale',
      },
    });
  }
}
