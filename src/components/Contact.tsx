import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Wypełnij wymagane pola");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Dziękujemy! Skontaktujemy się wkrótce.");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Nie udało się wysłać wiadomości. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-3 block">
              Kontakt
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Umów się na <span className="text-gradient">montaż</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Skontaktuj się z nami, aby omówić potrzeby Twojego pojazdu.
              Bezpłatna wycena i doradztwo.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Telefon</div>
                  <div className="font-medium">512 732 864</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">autosafe@o2.pl</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Adres</div>
                  <div className="font-medium">Zakrzewska Wola 85C, 26-652 Zakrzew</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Imię i nazwisko *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jan Kowalski"
                className="bg-background border-border"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Telefon *</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+48 123 456 789"
                className="bg-background border-border"
                maxLength={20}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Wiadomość</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Opisz czego potrzebujesz..."
                className="bg-background border-border min-h-[120px]"
                maxLength={1000}
              />
            </div>
            <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
