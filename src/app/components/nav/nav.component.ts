import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    activeMenu = false;
    counter = 0;
    token = '';
    profile: User | null = null;
    categories: Category[] = [];

    constructor(
        private storeService: StoreService,
        private authService: AuthService,
        private categoriesService: CategoriesService
    ) {}

    ngOnInit(): void {
        this.storeService.myCart$.subscribe(products => {
            this.counter = products.length;
        });
        this.getAllCategories();
    }

    toggleMenu() {
        this.activeMenu = !this.activeMenu;
    }

    // login() {
    //     this.authService.login(
    //         "nicolas@mail.com",
    //         "12345"
    //     )
    //         .subscribe(rta => {
    //             console.log(rta.access_token);
    //             this.token = rta.access_token;
    //             this.getProfile();
    //         });
    // }

    // getProfile() {
    //     this.authService.profile(this.token)
    //         .subscribe(user => {
    //             console.log(user);
    //             this.profile = user;
    //             console.log(this.profile);
    //         });
    // }

    loginAndGetProfile() {
        this.authService
            .loginAndGetProfile('jefry@mail.com', '12345')
            .subscribe(profile => {
                this.profile = profile;
                console.log(profile);
            });
    }

    getAllCategories() {
        this.categoriesService.getAll().subscribe(data => {
            this.categories = data;
        });
    }
}
