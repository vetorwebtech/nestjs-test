import {OnEvent} from "@nestjs/event-emitter";
import {UploadFileEvent} from "../../model/pojo/upload.file.event";
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export class UploadEventService {
    private readonly logger = new Logger(UploadEventService.name);

    constructor() {
    }

    @OnEvent('upload.file', { async: true })
    handleOrderCreatedEvent(payload: UploadFileEvent) {
        this.logger.log('ASYNC FILE NAME RECEIVED');
        this.logger.log(payload);
    }

}
