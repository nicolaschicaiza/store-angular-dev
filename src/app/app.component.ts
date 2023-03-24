import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    imgParent = 'https://www.w3schools.com/howto/img_avatar2.png';
    showImg = true;
    token = '';
    imgRta = '';

    constructor(
        private usersService: UsersService,
        private filesService: FilesService
    ) {}

    onLoaded(img: string) {
        console.log('log parent', img);
    }

    toggleImg() {
        this.showImg = !this.showImg;
    }

    createUser() {
        this.usersService
            .create({
                name: 'Nicolas',
                email: 'nicolas@mail.com',
                password: '12345'
            })
            .subscribe(rta => {
                console.log(rta);
            });
    }

    downloadPDF() {
        this.filesService
            .getFile(
                'my.pdf',
                'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf',
                'application/pdf'
            )
            .subscribe();
    }

    onUpload(event: Event) {
        const element = event.target as HTMLInputElement;
        const file = element.files?.item(0);
        if (file) {
            this.filesService.uploadFile(file).subscribe(rta => {
                this.imgRta = rta.location;
            });
        }
    }
}
