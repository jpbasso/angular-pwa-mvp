import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ChecklistField {
  name: string;
  type: string;
  label: string;
  min?: number;
  max?: number;
  options?: string[];
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  fields: ChecklistField[];
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private templatesKey = 'templates';
  private resultsKey = 'offline-results';

  constructor(private http: HttpClient) {}

  fetchTemplates(): Observable<ChecklistTemplate[]> {
    return this.http
      .get<ChecklistTemplate[]>('/templates.json')
      .pipe(tap((t) => localStorage.setItem(this.templatesKey, JSON.stringify(t))));
  }

  getStoredTemplates(): ChecklistTemplate[] {
    const data = localStorage.getItem(this.templatesKey);
    return data ? (JSON.parse(data) as ChecklistTemplate[]) : [];
  }

  storeResult(result: unknown): void {
    const current = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
    current.push(result);
    localStorage.setItem(this.resultsKey, JSON.stringify(current));
  }

  sendStoredResults(): Observable<unknown> {
    const current = JSON.parse(localStorage.getItem(this.resultsKey) || '[]');
    console.log('Enviando resultados', current);
    localStorage.removeItem(this.resultsKey);
    return of(current);
  }
}
