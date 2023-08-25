import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    isMenuOpen = false;
    isLogged: boolean = false;

    constructor(private router: Router, private authservice: AuthService) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.closeMenu();
            }
        });
    }
    ngOnInit(): void {}
    loggedIn() {
        return this.authservice.isLoggedIn() && this.authservice.getUserToken();
    }
    logout() {
        this.authservice.logout();
        alert('Vous venez de vous dèconnecter avec succes');
        this.router.navigate(['/']);
    }
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.closeMenu();
    }
}
