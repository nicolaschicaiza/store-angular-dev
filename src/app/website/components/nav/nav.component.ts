import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
        private categoriesService: CategoriesService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.storeService.myCart$.subscribe(products => {
            this.counter = products.length;
        });
        this.getAllCategories();
        this.authService.user$.subscribe(data => {
            this.profile = data;
        });
    }

    toggleMenu() {
        this.activeMenu = !this.activeMenu;
    }

    login() {
        this.authService
            .loginAndGet('maria@mail.com', '12345') // Role de cliente
            // .loginAndGet('admin@mail.com', 'admin123') // Role de administrador
            .subscribe(() => {
                // console.log(rta.access_token);
                // this.token = rta.access_token;
                // this.getProfile();
                this.router.navigate(['/profile']);
            });
    }

    getProfile() {
        // this.authService.profile(this.token).subscribe(user => {
        //     console.log(user);
        //     this.profile = user;
        //     console.log(this.profile);
        // });

        this.authService.getProfile().subscribe(profile => {
            this.profile = profile;
        });
    }

    loginAndGetProfile() {
        // this.authService
        //     .loginAndGetProfile('maria@mail.com', '12345')
        //     .subscribe(profile => {
        //         this.profile = profile;
        //         console.log(profile);
        //     });
        this.authService
            .loginAndGet('maria@mail.com', '12345')
            .subscribe(profile => {
                this.profile = profile;
            });
    }

    getAllCategories() {
        this.categoriesService.getAll().subscribe(data => {
            this.categories = data;
        });
    }

    logout() {
        this.authService.logout();
        this.profile = null;
        this.router.navigate(['/home']);
    }
}
