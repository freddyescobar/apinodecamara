import { Request, Response } from 'express';
// import autoBind from 'auto-bind';

import { Dependencies } from '../../dependency-injection';
import StorageRepository, { GetPreSignedUploadURL } from '../../domain/repositories/storage-repository';
import Get from '../../helpers/get';

export default class StorageController {
    private storageRepository = Get.find<StorageRepository>(Dependencies.storage);

    // constructor() {
    //     autoBind(this);
    // }

    
    getUploadUrl = async (req: Request, res: Response) => {
        try {
            const body = req.body as GetPreSignedUploadURL;
            const { Key, ContentType, ACL } = body;

            if (!Key || !ContentType || !ACL) {
                throw { code: 400, message: 'invalid body' };
            }

            if (ACL != 'private' && ACL != 'public-read') {
                throw { code: 400, message: 'invalid ACL' };
            }

            const url = this.storageRepository.getPreSignedUploadURL(body);
            res.send(url);
        } catch (err) {
            // var error = castError.expected(err)
            res.status(err.code ?? 500).send(err.message);
        }
    }


    deleteFile = async (req: Request, res: Response) => {
        try {
            
            const { key }: {key:string} = req.body;

            if (!key) {
                throw { code: 400, message: 'invalid body' };
            }

           const deleted = await this.storageRepository.deleteFile(key);
            res.send(deleted);
        } catch (err) {
            // var error = castError.expected(err)
            res.status(err.code ?? 500).send(err.message);
        }
    }



    getSignedURL = async (req: Request, res: Response) => {
        try {
            
            const { key }: {key:string} = req.body;

            if (!key) {
                throw { code: 400, message: 'invalid body' };
            }

           const url = this.storageRepository.getSignedURL(key);
            res.send(url);
        } catch (err) {
            // var error = castError.expected(err)
            res.status(err.code ?? 500).send(err.message);
        }
    }



}
