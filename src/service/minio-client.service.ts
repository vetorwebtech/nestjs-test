import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {MinioService} from 'nestjs-minio-client';
import * as crypto from 'crypto'
import {BufferedFile} from "../model/pojo/file.model";
import {MinioConstant} from "../constant/minio.constant";

@Injectable()
export class MinioClientService {
    private readonly logger = new Logger(MinioClientService.name);
    private readonly baseBucket = MinioConstant.MINIO_BUCKET

    public get client() {
        return this.minio.client;
    }

    constructor(private readonly minio: MinioService) {
    }

    public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
            throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        }
        let temp_filename = Date.now().toString()
        let hashedFileName = crypto.createHash('md5').update(temp_filename).digest("hex");
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        const metaData = {
            'Content-Type': file.mimetype,
            'X-Amz-Meta-Testing': 1234,
        };
        let filename = hashedFileName + ext
        const fileName: string = `${filename}`;
        const fileBuffer = file.buffer;
        this.client.putObject(baseBucket, fileName, fileBuffer, metaData, (err, res) => {
            if (err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
        })

        return {
            url: `${MinioConstant.MINIO_ENDPOINT}:${MinioConstant.MINIO_PORT}/${MinioConstant.MINIO_BUCKET}/${filename}`
        }
    }

    async delete(objetName: string, baseBucket: string = this.baseBucket) {
        this.client.removeObject(baseBucket, objetName, function (err, res) {
            if (err) throw new HttpException("Oops Something wrong happend", HttpStatus.BAD_REQUEST)
        })
    }
}
