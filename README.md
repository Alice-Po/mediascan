# News Aggregator MVP

## Description

This is a simple news aggregator MVP built with Node.js, Express, and MongoDB.

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/news-aggregator-mvp.git
```

2. Mount docker container Docker

```bash
npm run docker:up

ou

docker compose up -d
```

docker-compose logs mongo-express
Si besoin de log

3. Accède à Mongo Express:

Visite http://localhost:8081
Utilise les identifiants:

Utilisateur: dev
Mot de passe: devpassword

```


docker/
├── dev/
│   └── docker-compose.yml
└── prod/
    └── docker-compose.yml
 docker exec -it news-aggregator-mongodb mongo -u admin -p password
```

> use news_aggregator
> switched to db news_aggregator
> db.sources.insertOne({
> ... name: 'Les Echos',
> ... url: 'https://www.lesechos.fr',
> ... rssUrl: 'https://services.lesechos.fr/rss/les-echos-actualites.xml',
> ... faviconUrl: 'https://www.lesechos.fr/favicon.ico',
> ... categories: [
> ... 'économie',
> ... 'finance',
> ... 'entreprises',
> ... 'marchés'
> ... ],
> ... orientation: {
> ... political: 'centre-droit',
> ... type: 'spécialisé',
> ... structure: 'institutionnel',
> ... scope: 'économique'
> ... },
> ... defaultEnabled: true,
> ... isUserAdded: false,
> ... addedDate: new Date(),
> ... fetchStatus: {
> ... success: true,
> ... message: '',
> ... timestamp: new Date()
> ... },
> ... lastFetched: new Date(),
> ... updatedAt: new Date()
> ... })
> {

        "acknowledged" : true,
        "insertedId" : ObjectId("67eedb1469dc9b335f97d1d2")

}

> db.sources.find({name: 'Les Echos'})
> { "\_id" : ObjectId("67eedb1469dc9b335f97d1d2"), "name" : "Les Echos", "url" : "https://www.lesechos.fr", "rssUrl" : "https://services.lesechos.fr/rss/les-echos-actualites.xml", "faviconUrl" : "https://www.lesechos.fr/favicon.ico", "categories" : [ "économie", "finance", "entreprises", "marchés" ], "orientation" : { "political" : "centre-droit", "type" : "spécialisé", "structure" : "institutionnel", "scope" : "économique" }, "defaultEnabled" : true, "isUserAdded" : false, "addedDate" : ISODate("2025-04-03T19:01:40.885Z"), "fetchStatus" : { "success" : true, "message" : "", "timestamp" : ISODate("2025-04-03T19:01:40.885Z") }, "lastFetched" : ISODate("2025-04-03T19:01:40.885Z"), "updatedAt" : ISODate("2025-04-03T19:01:40.885Z") }
