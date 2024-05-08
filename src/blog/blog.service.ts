import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BlogEntity, SEOEntity } from "./blog.entity";
import { BlogBodyDTO, NewBlogBodyDTO, SEODTO } from "./blog.dto";
import { BLOG_RECENT_COUNT } from "src/constant";

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



    async insertBlog(blog: NewBlogBodyDTO): Promise<void> {
        await this.dataSource
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

    findRecentlyBlog(): Promise<BlogEntity[]> {
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
                take: BLOG_RECENT_COUNT
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
                    seos: body.seos
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
                    contents: true
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
                    }
                },
                where: {
                    id: blogID
                }
            });
    }

    async updateBlog(): Promise<void> {
        await this.dataSource
            .getRepository(BlogEntity)
            .update({ id: 1 }, { title: "d" });
    }

    async removeBlog(blogID: number): Promise<void> {
        await this.dataSource
            .getRepository(BlogEntity)
            .delete(blogID);
    }

}