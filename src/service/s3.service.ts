import {Injectable} from "@nestjs/common";
import {MinioService} from "nestjs-minio-client";

@Injectable()
export class S3Service {

    constructor(private readonly minioClient: MinioService) {
    }

    async listAllBuckets() {
        return this.minioClient.client.listBuckets();
    }

    async upload() {
        return this.minioClient.client.listBuckets();
    }
}
