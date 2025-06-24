import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service'; // ✅ Service pour accéder aux données centralisées
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, ScaleType } from '@swimlane/ngx-charts';

// ✅ Structure des données pour le graphique ngx-charts en lignes
interface LineChartData {
  name: string; // Nom du pays
  series: { name: string; value: number }[]; // Année + nombre de médailles
}

@Component({
  selector: 'app-detail',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  // ✅ Données du pays sélectionné
  country!: Olympic;

  // ✅ Données formatées pour le graphique
  lineMedalsData: LineChartData[] = [];

  // ✅ Statistiques globales
  totalMedals = 0;
  totalAthletes = 0;
  participations = 0;

  // ✅ Message d’erreur en cas d’échec
  errorMessage = '';

  // ✅ Taille dynamique du graphique (responsive)
  view: [number, number] = [0, 400];

  // ✅ Gestion des abonnements pour les nettoyer dans ngOnDestroy()
  private subscriptions = new Subscription();

  // ✅ Palette de couleurs personnalisée pour le graphique
  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#007C89']
  };

  // ✅ Méthode liée à l’événement resize (on la "lie" au contexte ici)
  private resizeListener = this.updateViewSize.bind(this);

  constructor(
    private route: ActivatedRoute,           // ✅ Pour lire l'ID dans l’URL
    private router: Router,                  // ✅ Pour rediriger en cas d’erreur
    private olympicService: OlympicService   // ✅ Service Angular pour accéder aux données
  ) {}

  ngOnInit(): void {
    this.updateViewSize(); // ✅ Calcul initial de la taille du graphique
    window.addEventListener('resize', this.resizeListener); // ✅ Écouteur d'événement pour rendre le graphique responsive

    // ✅ Récupère l’ID du pays depuis l’URL (ex : /country-details/3)
    const id = Number(this.route.snapshot.paramMap.get('country'));

    // ✅ Étape 1 : lance le chargement (si pas déjà fait)
    const loadSub = this.olympicService.loadInitialData().subscribe({
      next: () => {
        // ✅ Étape 2 : lit les données depuis le BehaviorSubject
        const dataSub = this.olympicService.getOlympics().subscribe((data) => {
          if (!data) return; // Aucune donnée ? On ne fait rien.

          // ✅ Recherche du pays par ID
          const found = data.find((c: Olympic) => c.id === id);

          if (!found) {
            this.router.navigate(['/404']); // Redirection si le pays est introuvable
            return;
          }

          // ✅ Stockage des données du pays sélectionné
          this.country = found;
          this.participations = found.participations.length;

          // ✅ Calcul du total de médailles
          this.totalMedals = found.participations.reduce(
            (sum, p) => sum + p.medalsCount,
            0
          );

          // ✅ Calcul du total d’athlètes
          this.totalAthletes = found.participations.reduce(
            (sum, p) => sum + p.athleteCount,
            0
          );

          // ✅ Formatage des données pour ngx-charts (graphique par année)
          this.lineMedalsData = [
            {
              name: found.country,
              series: found.participations.map((p) => ({
                name: String(p.year), // Année
                value: p.medalsCount  // Nombre de médailles
              }))
            }
          ];
        });

        // ✅ Ajout de l’abonnement à la liste pour pouvoir le nettoyer plus tard
        this.subscriptions.add(dataSub);
      },
      error: () => {
        this.errorMessage = '❌ Erreur de chargement des données.'; // Affiche un message en cas d’échec
      }
    });

    this.subscriptions.add(loadSub);
  }

  // ✅ Nettoyage quand le composant est détruit
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener); // ✅ On retire le listener resize
    this.subscriptions.unsubscribe(); // ✅ On se désabonne de tous les abonnements RxJS pour éviter les fuites mémoire
  }

  // ✅ Met à jour la taille du graphique en fonction de la largeur de la fenêtre
  private updateViewSize(): void {
    const width = window.innerWidth;
    this.view = [width > 768 ? width * 0.8 : width * 0.95, 400];
  }

  // ✅ Retour à la page d’accueil (ex : via bouton "Retour")
  goBack(): void {
    this.router.navigate(['/']);
  }
}
