import {Injectable, Logger} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);

    @Cron(CronExpression.EVERY_5_MINUTES)
    handleCron() {
        this.logger.debug('Called every 5 minutes');
    }
}
