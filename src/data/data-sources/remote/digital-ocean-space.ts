import { S3, Endpoint } from 'aws-sdk';
import { GetPreSignedUploadURL } from '../../../domain/repositories/storage-repository';

export default class DigitalOceanSpace {
    private s3!:S3;
    constructor(){
        this.s3 = new S3({
            endpoint: new Endpoint(process.env.ENDPOINT!),
            accessKeyId: process.env.SPACES_KEY,
            secretAccessKey: process.env.SPACES_SECRET
        })
    }


    getPresignedUtlToUpload(data: GetPreSignedUploadURL): string {
        const expireSeconds = 60 * 5;

        const url = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.BUCKET_NAME,
            // Key: data.Key,
            // ContentType: data.ContentType,
            // ACL: data.ACL,
            ...data,
            Expires: expireSeconds,
        });

        return url;
  }

  deleteFile(Key:string):Promise<boolean> {

    const promise = new Promise<boolean>(

        (resolve, reject) => {
            this.s3.deleteObject({
                Bucket: process.env.BUCKET_NAME!,
                Key
            },
            (error, data) => {
                if(error) {
                    console.log(error, error.stack);
                    resolve(false);
                } else {
                    console.log(data);
                    resolve(true);
                }
            });
        

        }
    );

    return promise;

  }


  getSignedURL(Key:string) {
    const url = this.s3.getSignedUrl('getObject',{
        Bucket: process.env.BUCKET_NAME!,
        Key,
        Expires: 60 * 5,
    });

    return url.replace("video-camera.sfo3.digitaloceanspaces.com", process.env.CDN!);
  }


}

