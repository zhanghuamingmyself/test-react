#docker login -u sunwc --password-stdin @Sunwanchao*  10.101.7.108:80/szhems_demo_prod/

#echo "@Sunwanchao*" | docker login -u sunwc --password-stdin szharbor.hithium.cn:80/szhems_demo_prod/
#echo "@Sunwanchao*" | docker login -u sunwc --password-stdin 10.101.7.108:80/szhems_demo_prod/
#echo "Harbor12345" | docker login -u admin --password-stdin 172.24.73.32:443
echo "Aa123456" | docker login ccr.ccs.tencentyun.com --username=100037282021 --password-stdin


repository="ccr.ccs.tencentyun.com/tsf_100002806844/zhm-react"

tag="v1.0.1"

image="${repository}:${tag}"

docker build -t ${image} ..

docker push ${image}

#kubectl create namespace szhems

kubectl create secret docker-registry regcred \
  --docker-server=ccr.ccs.tencentyun.com \
  --docker-username=100037282021 \
  --docker-password=Aa123456 \
  --namespace=szhems

kubectl apply -f deployment.yaml
