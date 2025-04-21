docker login -u sunwc --password-stdin @Sunwanchao*  10.101.7.108:80/szhems_demo_prod/

docker build -t 10.101.7.108:80/szhems_demo_prod/zhm-react:v1.0.1  .

docker push 10.101.7.108:80/szhems_demo_prod/zhm-react:v1.0.1

kubectl apply -f deployment.yaml
