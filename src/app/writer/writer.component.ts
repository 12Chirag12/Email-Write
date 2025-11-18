import { Component, ViewChild, ElementRef } from '@angular/core';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-writer',
  templateUrl: './writer.component.html',
  styleUrls: ['./writer.component.css']
})
export class WriterComponent {
  showLeft = true;
  showPreview = false;

  emailobject: any = {
    language: 'English',
    tone: 'Convincing',
    useCase: 'Email',
    keyPoints: '',
    variants: 1,
    creativity: 'Optimal'
  };

  subject = 'Your Valuable Feedback on the Latest Website Mockup';
  recipient = "[Client's Name]";
  body: string = `Hello ${this.recipient},\n\nPlease review the latest mockup and share your feedback.`;

  @ViewChild('previewBody', { static: false }) previewBody?: ElementRef<HTMLDivElement>;

  constructor(private gemini: GeminiService) {}

  togglePanel(){ this.showLeft = !this.showLeft; }

  private plainTextFromHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return (div.textContent || div.innerText || '').trim();
  }

  get wordCount(): number {
    const text = this.plainTextFromHtml(this.body);
    if (!text) return 0;
    return text.split(/\s+/).filter(w => w.length).length;
  }

  get charCount(): number { return this.plainTextFromHtml(this.body).length; }

  get paragraphs(): string[] {
    if (!this.body) return [];
    return this.body.split(/\n\n/).map(p => p.trim()).filter(p => p.length);
  }

  get bodyHtml(): string {
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(this.body);
    if (isHtml) return this.body;
    return this.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  onPreviewInput(){
    if (!this.previewBody) return;
    this.body = this.previewBody.nativeElement.innerHTML;
  }

  format(command: string){
    if (!this.previewBody) return;
    if (command === 'h1'){
      document.execCommand('formatBlock', false, 'h1');
    } else if (command === 'h2'){
      document.execCommand('formatBlock', false, 'h2');
    } else {
      document.execCommand(command, false, undefined);
    }
    this.body = this.previewBody.nativeElement.innerHTML;
  }

  generateEmail(){
    this.showPreview = true;
    const prompt = `Generate an email using the object: ${JSON.stringify(this.emailobject)}`;
    this.gemini.generateEmail(prompt).subscribe(res => {
      const text = res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      try {
        const cleaned = text.replace(/```json|```/g,'').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed[0]){
          const item = parsed[0];
          this.subject = item.subject || this.subject;
          this.body = (item.body || '') + `\n\nBest regards,\n[Your Name]`;
        } else if (typeof parsed === 'string'){
          this.body = parsed;
        }
      } catch(e){
        this.body = text || this.body;
      }
    }, err => { console.error(err); });
  }

  copyPlain(){
    const plain = this.plainTextFromHtml(this.body);
    const text = `${this.subject}\n\nHello ${this.recipient},\n\n${plain}\n\nBest regards,\n[Your Name]`;
    if (navigator && (navigator as any).clipboard && (navigator as any).clipboard.writeText){
      (navigator as any).clipboard.writeText(text).catch(()=> alert('Copy failed'));
    } else {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
  }

  getHtml(){
    const bodyHtml = /<\/?[a-z][\s\S]*>/i.test(this.body) ? this.body : this.paragraphs.map(p => `<p>${p}</p>`).join('\n');
    return `<div style="font-family:Inter, system-ui; color:#0f172a;"><h3>${this.subject}</h3><p>Hello ${this.recipient},</p>${bodyHtml}<p>Best regards,<br/>[Your Name]</p></div>`;
  }

  exportHtml(){
    const html = this.getHtml();
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'email_preview.html'; document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
}
