# Étape 1: Utiliser Nginx comme image de base
FROM nginx:alpine

# Étape 2: Supprimer la configuration Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Étape 3: Copier les fichiers de distribution
COPY dist/olympic-games-starter /usr/share/nginx/html

# Étape 4: Copier la configuration Nginx personnalisée si nécessaire
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Étape 5: Exposer le port 80
EXPOSE 80

# Étape 6: Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]