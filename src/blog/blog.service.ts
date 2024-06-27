import { Body, Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BlogEntity, SEOEntity } from "./blog.entity";
import { BlogBodyDTO, NewBlogBodyDTO, SEODTO, SEOListBodyDTO } from "./blog.dto";
import { BLOG_RECENT_COUNT } from "src/constant";
import { ContentEntity } from "src/content/content.entity";

@Injectable()

export class BlogService {
    constructor(
        private dataSource: DataSource
    ) { }

    async insertSEO(seo: SEODTO): Promise<void> {
        await this.dataSource
            .getRepository(SEOEntity)
            .save(seo)
    }

    getSEOTotal(): Promise<number> {
        return this.dataSource
            .getRepository(SEOEntity)
            .count();
    }

    findSEOList(@Body() body: SEOListBodyDTO): Promise<SEOEntity[]> {
        return this.dataSource
            .getRepository(SEOEntity)
            .find({
                order: {
                    createAt: 'desc'
                },
                skip: body.offset,
                take: body.limit
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

    async updateSEO(seo: SEODTO): Promise<void> {
        await this.dataSource
            .getRepository(SEOEntity)
            .update({ id: seo.id }, seo);
    }

    async removeSEO(id: number): Promise<void> {
        await this.dataSource
            .getRepository(SEOEntity)
            .delete(id);
    }



    async insertBlog(blog: NewBlogBodyDTO): Promise<BlogEntity> {
        return await this.dataSource
            .getRepository(BlogEntity)
            .save(blog)
    }

    getBlogTotalCount(body: BlogBodyDTO): Promise<Number> {
        return this.dataSource
            .getRepository(BlogEntity)
            .count({
                where: {
                    seos: body.seos
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

    findAllBlog(body: BlogBodyDTO): Promise<BlogEntity[]> {
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
                    seos: body.seos,
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

    async updateBlog(body: NewBlogBodyDTO): Promise<BlogEntity> {
        const update = await this.dataSource
            .getRepository(BlogEntity)
            .findOne({
                relations: {
                    contents: true
                },
                where: {
                    id: body.id
                }
            });
        update.seos = [];
        for (const seo of body.seos) {
            const updatedSEO = await this.dataSource
                .getRepository(SEOEntity)
                .findOne({
                    where: { id: seo.id }
                });
            update.seos.push(updatedSEO)
        }
        update.contents = [];
        for (const content of body.contents) {
            const updatedContent = await this.dataSource
                .getRepository(ContentEntity)
                .save(content);
            update.contents.push(updatedContent);
        }
        update.title = body.title;
        update.bgImg = body.bgImg;
        update.description = body.description;
        return await this.dataSource
            .getRepository(BlogEntity)
            .save(update);
    }

    async removeBlog(blogID: number): Promise<void> {
        await this.dataSource
            .getRepository(BlogEntity)
            .delete(blogID);
    }

}