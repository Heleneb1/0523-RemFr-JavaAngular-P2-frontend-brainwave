import Quill from 'quill';
import 'quill-emoji/dist/quill-emoji.js';
import { Component, AfterViewInit, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { Promotion } from 'src/models/Promotion';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment.development';

import { PromotionsService } from 'src/app/services/promotions.services';

@Component({
    selector: 'app-promotions',
    templateUrl: './create-promotions.component.html',
    styleUrls: ['./create-promotions.component.scss'],
})
export class CreatePromotionsComponent implements AfterViewInit, OnInit {
    @Output() promoAdded: EventEmitter<Promotion> = new EventEmitter<Promotion>();
    showModal = false;
    quill!: Quill;
    textValue: string;
    description: string;
    defaultPicture = 'assets/images/logo.svg';
    picture: string;
    tag: string;
    type: string;
    difficulty: string;
    rating: number;
    createdPromoId: string;
    userConnected!: any;
    userId!: string;

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private promotionsService: PromotionsService,
        private router: Router,
        private authService: AuthService
    ) {
        this.createdPromoId = this.promotionsService.getCreatedPromotionId();
        this.userConnected = this.authService.getUserConnected();
        this.textValue = '';
        this.description = '';
        this.picture = '';
        this.tag = '';
        this.type = '';
        this.difficulty = '';
        this.rating = 3.5;
        this.createdPromoId = '';
        this.authService.getUserConnected().subscribe((user: any) => {
            this.userConnected = user;
            this.userId = user?.userId;
        });
    }
    openParticipantsModal(): void {
        this.showModal = true;
    }

    closeParticipantsModal(): void {
        this.showModal = false;
    }
    ngOnInit(): void {
        this.userService.getUsers();
    }

    ngAfterViewInit() {
        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            ['emoji', 'link', 'image', 'video'],
            [{ color: [] }, { background: [] }],
            ['clean'],
            [{ size: ['small', false, 'large', 'huge'] }],
        ];

        this.quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions,
                'emoji-toolbar': true,
                'emoji-textarea': true,
                'emoji-shortname': true,
            },
            theme: 'snow',
        });

        const emojiButton = this.quill.getModule('emoji-toolbar');
        emojiButton.initToolbar();
    }
    createPromotion(): void {
        const descriptionText = this.quill.root.innerHTML;

        const userId = this.userConnected.id;
        const url = environment.apiUrl + `/promotions/${userId}`;

        const data = {
            description: descriptionText,
            name: this.textValue,
            picture: this.picture || this.defaultPicture,
            tag: this.tag,
            type: this.type,
            difficulty: this.difficulty,
            rating: this.rating,
        };
        this.http.post<Promotion>(url, data).subscribe(
            (response) => {
                const createdPromotionId = response.id;
                localStorage.setItem('createdPromotionId', createdPromotionId);
                this.promoAdded.emit(response);
                alert('La promotion est créée avec succès !');
                this.createdPromoId;
                this.promotionsService.setCreatedPromotionId(createdPromotionId);
                this.showModal = true;
            },
            (error) => {
                console.error('Failed to create promotion', error);
            }
        );
    }
}
