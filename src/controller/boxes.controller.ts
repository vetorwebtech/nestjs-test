import {AbstractController} from "../common/abstract.controller";
import {Box} from "../model/box";
import {Repository, SelectQueryBuilder} from "typeorm";
import {Controller} from "@nestjs/common";
import {BOXES_PATH} from "../constant/app.constant";
import {InjectRepository} from "@nestjs/typeorm";

@Controller(BOXES_PATH)
export class BoxesController extends AbstractController<Box, string> {
    constructor(@InjectRepository(Box) private boxRepository: Repository<Box>) {
        super(boxRepository);
    }

    protected getDefaultOrderBy(): string {
        return " name asc";
    }

    protected getSearch(query: any, orderBy: string): SelectQueryBuilder<Box> {
        const search: SelectQueryBuilder<Box> = this.boxRepository.createQueryBuilder();
        if (query['like.name']) {
            search
                .andWhere('name like :name')
                .setParameter('name', this.likeParam(query['like.name']));
        }
        return search;
    }

}
