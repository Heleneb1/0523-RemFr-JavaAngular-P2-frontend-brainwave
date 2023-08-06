import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Promotion } from 'src/models/Promotion';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment.development';

type Participant = {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
};

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  private createdPromotionId = '';
  private promoDataUrl = environment.apiUrl + '/promotions';
  constructor(private httpClient: HttpClient, private userService: UserService) {}

  getPromotions(): Observable<object> {
    return this.httpClient.get(this.promoDataUrl);
  }
  insertPromotion(data: any) {
    return this.httpClient.post(this.promoDataUrl, data);
  }
  getPromoById(promoId: string): Observable<Promotion | undefined> {
    return this.httpClient
      .get<Promotion[]>(this.promoDataUrl)
      .pipe(map((promotions: Promotion[]) => promotions.find((promo: Promotion) => promo.id === promoId)));
  }
  getPromoByAuthor(authorId: string): Observable<any> {
    this.userService
      .getUserById(authorId)
      .pipe(map((promotions: Promotion[]) => promotions.find((promo: Promotion) => authorId === promo.authorId)));
    map((author: any) => {
      return {
        firstname: author.firstname,
        lastname: author.lastname,
      };
    });

    return this.httpClient.get<Promotion[]>(this.promoDataUrl);
  }
  updateDescription(promotionId: string, updatedDescription: string,  authorId: string) {
    const url = environment.apiUrl + `/promotions/${promotionId}/users/${ authorId}`;

     this.httpClient.put<any>(url, { description: updatedDescription }).subscribe(
      updatedPromotion => {
        console.log('Promotion mise à jour avec le vote :', updatedPromotion);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la promotion :', error);
      }
    );
  };
  
  getParticipantName(participantId: string): Observable<Participant> {
    return this.userService.getUserById(participantId).pipe(
      map((user: any) => {
        return {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        };
      })
    );
  }
  getTopicReplies(topicId: string, answerId: string): Observable<any[]> {
    const url = `${environment.apiUrl}/${answerId}/topics/${topicId}`;
    return this.httpClient.get<any[]>(url);
  }

  getParticipantId(participantId: string): Observable<any> {
    return this.userService.getUserById(participantId);
  }

  deleteParticipantById(promoId: string, participantId: any, authorId: string): Observable<any> {
    return this.httpClient.delete(
      `${this.promoDataUrl}/${promoId}/users/${authorId}/delete-participant/${participantId}`
    );
  }

  deletePromotion(id: string): Observable<void> {
    const url = `${this.promoDataUrl}/${id}`;
    return this.httpClient.delete<void>(url);
  }

  addParticipantsToPromotion(promotionId: string, participantIds: string[]) {
    const url = environment.apiUrl + `/promotions/${promotionId}/add-participants`;
    return this.httpClient.put(url, { participants: participantIds });
  }
  addRating(promotionId: string, userRating: number, authorId: string) {
    const url = environment.apiUrl + `/promotions/${promotionId}/users/${authorId}`;

    this.httpClient.put<any>(url, { rating: userRating }).subscribe(
      updatedPromotion => {
        console.log('Promotion mise à jour avec le vote :', updatedPromotion);
      },
      error => {
        console.error('Erreur lors de la mise à jour de la promotion :', error);
      }
    );
  }

  getResourceById(resourceId: string): Observable<any> {
    const url = environment.apiUrl + `/resources/${resourceId}`;
    return this.httpClient.get<any>(url);
  }

  geTopicById(topicId: string): Observable<any> {
    const url = environment.apiUrl + `/topics/${topicId}`;
    return this.httpClient.get<any>(url);
  }
  setCreatedPromotionId(promotionId: string): void {
    this.createdPromotionId = promotionId;
    console.log('Promotion ID stored:', this.createdPromotionId);
  }

  getCreatedPromotionId(): string {
    return this.createdPromotionId;
  }
}
