install minikube with chocolatey

lancer minikube start avec un terminal admin, verifier avec le status.

aller a la racine du projet et faire le docker-compose up --build -d

le container créer, il ne reste plus qu'a deployer les yaml. a la racine du projet 

cd billetterie -> kubectl apply -f deployment-billeterie.yaml
cd event -> kubectl apply -f deployment-event.yaml

pour verifier : kubectl get deployments
                kubectl get services