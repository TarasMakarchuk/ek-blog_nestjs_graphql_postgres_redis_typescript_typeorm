import {User} from "../../entities/user.entity";
import {Role} from "../../users/role/role.enum";
import {Article} from "../../entities/article.entity";

export default class TestUtil {
    static getValidUser(): User {
        const user = new User();
        user.id = 1;
        user.role = Role.USER;
        user.firstName = 'valid';
        user.lastName = 'user';
        user.email = 'valid@gmail.com';
        user.phoneNumber = '+38063876';
        user.password = '111';

        return user;
    };

    static getValidUserRegistration(): User {
        const user = new User();
        user.id = 2;
        user.role = Role.USER;
        user.firstName = 'valid_2';
        user.lastName = 'user_2';
        user.email = 'valid_2@gmail.com';
        user.phoneNumber = '+38063877';
        user.password = '111';

        return user;
    };

    static getArticle(): Article {
        const article = new Article();
        article.id = 1;
        article.title = 'test article';
        article.content = 'test content';
        article.author = this.getValidUser();

        return article;
    }

    static getLoggedInUser() {
       return  {
            token: "user_token",
            user: TestUtil.getValidUser()
        }
    };

    static getRegisteredUser() {
           return  {
                token: "user_token",
                user: TestUtil.getValidUserRegistration()
            }
        };

}
