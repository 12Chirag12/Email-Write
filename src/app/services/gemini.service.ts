import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class GeminiService {

	constructor(private http: HttpClient) {}

 private apikey='AIzaSyAWZKRypBkw7sMf52L1bS8HFBKnPYyYoXo';

	 private apiUrl2 = 
	'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';


	type: string = '';
	purpose: string = '';
	tone: string = '';
	extra: string = '';
	generatedEmail: string = '';

 

	generateEmail(prompt:string): Observable<any>{
		const url = `${this.apiUrl2}?key=${this.apikey}`;
		const body = {
			contents: [
				{
					parts:[
						{text: prompt}
					]
				}
			]
		};

		return this.http.post<any>(url, body);
	}
}
