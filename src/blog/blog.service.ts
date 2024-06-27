import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BlogEntity, SEOEntity } from "./blog.entity";
import {
    ListAllEntities,
    NewBlogBodyDTO,
    UpdateBlogBodyDTO,
    SEODTO,
} from "./blog.dto";
import { ContentEntity } from "src/content/content.entity";

@Injectable()

export class BlogService {
    constructor(
        private dataSource: DataSource
    ) { }

    async createSEO(seo: SEODTO): Promise<SEODTO> {
        return await this.dataSource
            .getRepository(SEOEntity)
            .save(seo)
    }

    getSEOTotal(): Promise<number> {
        return this.dataSource
            .getRepository(SEOEntity)
            .count();
    }

    findAllPaginatedSEO(limit: number, offset: number): Promise<SEOEntity[]> {
        return this.dataSource
            .getRepository(SEOEntity)
            .find({
                order: {
                    createAt: 'desc'
                },
                skip: offset,
                take: limit
            })
    }

    findAllSEO(): Promise<SEOEntity[]> {
        return this.dataSource
            .getRepository(SEOEntity)
            .find({
                select: {
                    id: true,
                    keyword: true
                },
                order: {
                    keyword: 'ASC'
                }
            });
    }

    findOneSEO(keyword: string): Promise<SEOEntity | null> {
        return this.dataSource
            .getRepository(SEOEntity)
            .findOne({
                where: {
                    keyword
                }
            });
    }

    async updateSEO(id: number, update: SEODTO): Promise<SEOEntity> {
        await this.dataSource
            .getRepository(SEOEntity)
            .update({ id }, update);
        return this.findOneSEO(update.keyword);
    }

    async removeSEO(id: number): Promise<{ id: number }> {
        await this.dataSource
            .getRepository(SEOEntity)
            .delete(id);
        return { id }
    }



    async createBlog(blog: NewBlogBodyDTO): Promise<BlogEntity> {
        return await this.dataSource
            .getRepository(BlogEntity)
            .save(blog)
    }

    getBlogTotalCount(body: ListAllEntities): Promise<Number> {
        return this.dataSource
            .getRepository(BlogEntity)
            .count({
                where: {
                    seos: body.seo
                }
            });
    }

    findAllActiveBlog(): Promise<BlogEntity[]> {
        return this.dataSource
            .getRepository(BlogEntity)
            .find({
                select: {
                    id: true,
                    title: true,
                    bgImg: true,
                    createAt: true
                },
                order: {
                    createAt: 'DESC'
                },
                where: {
                    active: true
                }
            })
    }

    findAllBlog(body: ListAllEntities): Promise<BlogEntity[]> {
        return this.dataSource
            .getRepository(BlogEntity)
            .find({
                select: {
                    id: true,
                    title: true,
                    bgImg: true,
                    createAt: true
                },
                where: {
                    seos: body.seo,
                },
                take: body.limit,
                skip: body.offset,
            });
    }

    findOneBlog(blogID: number): Promise<BlogEntity> {
        return this.dataSource
            .getRepository(BlogEntity)
            .findOne({
                relations: {
                    contents: true,
                    images: true
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    bgImg: true,
                    createAt: true,
                    contents: {
                        id: true,
                        question: true,
                        content: true
                    },
                    images: {
                        id: true,
                        url: true
                    }
                },
                where: {
                    id: blogID
                }
            });
    }

    async updateBlog(id: number, update: UpdateBlogBodyDTO): Promise<BlogEntity> {
        await this.dataSource
            .getRepository(BlogEntity)
            .update({ id }, { ...update.blog });
        const blog = await this.dataSource
            .getRepository(BlogEntity)
            .findOneBy({ id });
        blog.seos = [];
        update?.seos?.map(async (a) => {
            const seo = await this.dataSource
                .getRepository(SEOEntity)
                .findOneBy({ id: a.id });
            blog.seos.push(seo);
        })
        await this.dataSource
            .getRepository(BlogEntity)
            .save(blog);
        update?.contents?.new?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .save({ ...a, blog: { id } });
        });
        update?.contents?.update?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .update({ id: a.id }, a)
        });
        update?.contents?.remove?.map(async (a) => {
            await this.dataSource
                .getRepository(ContentEntity)
                .delete(a)
        });
        return this.findOneBlog(id);
    }

    async removeBlog(id: number): Promise<{ id: number }> {
        await this.dataSource
            .getRepository(BlogEntity)
            .delete(id);
        return { id };
    }

}