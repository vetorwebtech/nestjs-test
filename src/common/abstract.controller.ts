import {Repository, SelectQueryBuilder} from "typeorm";
import {
    Body,
    DefaultValuePipe,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res
} from "@nestjs/common";
import {DeleteResult} from "typeorm/query-builder/result/DeleteResult";

export abstract class AbstractController<T, U> {
    constructor(private repository: Repository<T>) {
    }

    protected abstract getDefaultOrderBy(): string;

    protected abstract getSearch(query: any, orderBy: string): SelectQueryBuilder<T>;

    protected prePersist(object: T): void {
    }

    protected postPersist(t: T): void {
    }

    protected postFetch(t: T): void {
    }

    protected preUpdate(t: T): T {
        return t;
    }

    protected postUpdate(t: T): void {
    }

    protected preDelete(id: U): void {
    }

    protected postDelete(id: U): void {
    }

    protected postList(list: T[]): void {
    }


    @Post()
    async persist(@Body() t: T) {
        this.prePersist(t);
        const tCreated: T = await this.repository.save(t);
        this.postPersist(tCreated);
        return tCreated;
    }

    @Put(':id')
    async update(@Param('id') id: U, @Body() t: T) {
        this.preUpdate(t);
        const tUpdated: T = await this.repository.save(t);
        return tUpdated;
    }

    @Delete(':id')
    async delete(@Param('id') id: U) {
        this.preDelete(id);
        const tDeleted: DeleteResult = await this.repository.delete(id);
        return tDeleted;
    }

    @Get(':id')
    async fecth(@Param('id') id: U) {
        const post = await this.repository.findOne(id);
        if (post) {
            return post;
        }
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }

    @Get()
    async list(@Query("startRow", new DefaultValuePipe(0)) startRow: number,
               @Query("pageSize", new DefaultValuePipe(10)) pageSize: number,
               @Query("orderBy") orderBy: string,
               @Query() query,
               @Req() req,
               @Res() res) {
        if (!orderBy) orderBy = this.getDefaultOrderBy();
        const search: SelectQueryBuilder<T> = this.getSearch(query, orderBy);
        search.skip(startRow).take(pageSize);
        const result = await search.orderBy('name', "ASC").getManyAndCount();
        return res.set("Access-Control-Expose-Headers", "startRow, pageSize, listSize")
            .set("startRow", '' + startRow)
            .set("pageSize", '' + pageSize)
            .set("listSize", '' + result[1])
            .json(result[0]);
    }

    private sort(orderBy: string, search: SelectQueryBuilder<T>) {
        if (orderBy != null && !orderBy.trim()) {
            orderBy = orderBy.toLowerCase();
            if (orderBy != null && orderBy.indexOf(",")) {
                const orderByClause: string[] = orderBy.split(",");
                for (const pz of orderByClause) {
                    this.single(search, pz);
                }
            } else {
                this.single(search, orderBy);
            }
        }
        if (this.getDefaultOrderBy() != null && !this.getDefaultOrderBy().trim()) {
            if (this.getDefaultOrderBy().toLowerCase().indexOf("asc") > 0)
                search.addOrderBy(this.getDefaultOrderBy().toLowerCase().replace("asc", "").trim(), "ASC");
            if (this.getDefaultOrderBy().toLowerCase().indexOf("desc") > 0)
                search.addOrderBy(this.getDefaultOrderBy().toLowerCase().replace("desc", "").trim(), "DESC");
        }

    }

    private single(search: SelectQueryBuilder<T>, orderBy: string): void {
        let orderByClause: string[] = [];
        if (orderBy.indexOf(":") > 0) {
            orderByClause = orderBy.split(":");
        } else {
            orderByClause = orderBy.split(" ");
        }
        if (orderByClause.length > 1) {
            if (orderByClause[1].toLowerCase() === "asc") {
                search.addOrderBy(orderByClause[0], "ASC");
            } else if (orderByClause[1].toLowerCase() === "desc") {
                search.addOrderBy(orderByClause[0], "DESC");
            }
        } else {
            search.addOrderBy(orderBy, "DESC");
        }
    }

    protected likeParam(param: string): string {
        return "%" + param + "%";
    }

    protected likeParamL(param: string): string {
        return "%" + param;
    }

    protected likeParamR(param: string): string {
        return param + "%";
    }

}
