// Kubernetes Mock Data - Simulating real K8S API responses

// Types
export interface Namespace {
  name: string
  status: "Active" | "Terminating"
  labels: Record<string, string>
  createdAt: string
  podCount: number
}

export interface Pod {
  name: string
  namespace: string
  status: "Running" | "Pending" | "Failed" | "Succeeded" | "CrashLoopBackOff" | "ImagePullBackOff" | "Terminating"
  ready: string
  restarts: number
  age: string
  cpu: string
  memory: string
  node: string
  ip: string
  containers: Container[]
  labels: Record<string, string>
}

export interface Container {
  name: string
  image: string
  ready: boolean
  restartCount: number
  state: "running" | "waiting" | "terminated"
}

export interface Deployment {
  name: string
  namespace: string
  replicas: string
  availableReplicas: number
  readyReplicas: number
  desiredReplicas: number
  image: string
  age: string
  strategy: "RollingUpdate" | "Recreate"
  labels: Record<string, string>
}

export interface Service {
  name: string
  namespace: string
  type: "ClusterIP" | "NodePort" | "LoadBalancer" | "ExternalName"
  clusterIP: string
  externalIP?: string
  ports: string
  selector: Record<string, string>
  age: string
}

export interface Node {
  name: string
  status: "Ready" | "NotReady" | "SchedulingDisabled"
  roles: string[]
  version: string
  os: string
  kernel: string
  containerRuntime: string
  cpu: { capacity: string; allocatable: string; used: string }
  memory: { capacity: string; allocatable: string; used: string }
  pods: { capacity: number; allocatable: number; used: number }
  age: string
  conditions: NodeCondition[]
}

export interface NodeCondition {
  type: string
  status: "True" | "False" | "Unknown"
  message: string
}

export interface PersistentVolumeClaim {
  name: string
  namespace: string
  status: "Bound" | "Pending" | "Lost"
  volume: string
  capacity: string
  accessModes: string[]
  storageClass: string
  age: string
}

export interface ConfigMap {
  name: string
  namespace: string
  data: Record<string, string>
  age: string
}

export interface Secret {
  name: string
  namespace: string
  type: string
  dataKeys: string[]
  age: string
}

export interface Event {
  type: "Normal" | "Warning"
  reason: string
  message: string
  object: string
  namespace: string
  count: number
  firstSeen: string
  lastSeen: string
}

export interface Ingress {
  name: string
  namespace: string
  hosts: string[]
  address: string
  ports: string
  age: string
}

export interface StatefulSet {
  name: string
  namespace: string
  ready: string
  age: string
  image: string
}

export interface DaemonSet {
  name: string
  namespace: string
  desired: number
  current: number
  ready: number
  available: number
  age: string
}

export interface Job {
  name: string
  namespace: string
  completions: string
  duration: string
  age: string
  status: "Complete" | "Running" | "Failed"
}

export interface CronJob {
  name: string
  namespace: string
  schedule: string
  suspend: boolean
  active: number
  lastSchedule: string
  age: string
}

export interface ServiceAccount {
  name: string
  namespace: string
  secrets: number
  age: string
}

export interface StorageClass {
  name: string
  provisioner: string
  reclaimPolicy: "Delete" | "Retain"
  volumeBindingMode: string
  allowVolumeExpansion: boolean
  isDefault: boolean
  age: string
}

// Custom Resource Definitions
export interface CustomResourceDefinition {
  name: string
  group: string
  version: string
  scope: "Namespaced" | "Cluster"
  kind: string
  shortNames: string[]
  established: boolean
  age: string
}

export interface Certificate {
  name: string
  namespace: string
  ready: boolean
  secretName: string
  issuer: string
  status: "True" | "False" | "Unknown"
  expiry: string
  age: string
}

export interface VirtualService {
  name: string
  namespace: string
  hosts: string[]
  gateways: string[]
  age: string
}

export interface Kustomization {
  name: string
  namespace: string
  path: string
  sourceRef: string
  ready: boolean
  status: string
  age: string
}

// Mock Data
export const namespaces: Namespace[] = [
  { name: "default", status: "Active", labels: { "kubernetes.io/metadata.name": "default" }, createdAt: "10d", podCount: 12 },
  { name: "kube-system", status: "Active", labels: { "kubernetes.io/metadata.name": "kube-system" }, createdAt: "10d", podCount: 8 },
  { name: "kube-public", status: "Active", labels: { "kubernetes.io/metadata.name": "kube-public" }, createdAt: "10d", podCount: 0 },
  { name: "kube-node-lease", status: "Active", labels: { "kubernetes.io/metadata.name": "kube-node-lease" }, createdAt: "10d", podCount: 0 },
  { name: "monitoring", status: "Active", labels: { "app": "prometheus", "team": "observability" }, createdAt: "5d", podCount: 6 },
  { name: "ingress-nginx", status: "Active", labels: { "app.kubernetes.io/name": "ingress-nginx" }, createdAt: "7d", podCount: 2 },
  { name: "development", status: "Active", labels: { "environment": "dev", "team": "backend" }, createdAt: "3d", podCount: 4 },
  { name: "staging", status: "Active", labels: { "environment": "staging" }, createdAt: "2d", podCount: 3 },
]

export const pods: Pod[] = [
  // default namespace
  {
    name: "nginx-deployment-7c8f95c8b9-x2k4l",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "2d",
    cpu: "10m",
    memory: "128Mi",
    node: "minikube",
    ip: "172.17.0.5",
    containers: [{ name: "nginx", image: "nginx:1.25.3", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "nginx", "pod-template-hash": "7c8f95c8b9" }
  },
  {
    name: "nginx-deployment-7c8f95c8b9-abc12",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "2d",
    cpu: "12m",
    memory: "132Mi",
    node: "minikube",
    ip: "172.17.0.6",
    containers: [{ name: "nginx", image: "nginx:1.25.3", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "nginx", "pod-template-hash": "7c8f95c8b9" }
  },
  {
    name: "nginx-deployment-7c8f95c8b9-def34",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 1,
    age: "2d",
    cpu: "8m",
    memory: "125Mi",
    node: "minikube",
    ip: "172.17.0.7",
    containers: [{ name: "nginx", image: "nginx:1.25.3", ready: true, restartCount: 1, state: "running" }],
    labels: { app: "nginx", "pod-template-hash": "7c8f95c8b9" }
  },
  {
    name: "redis-master-0",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 2,
    age: "5d",
    cpu: "50m",
    memory: "256Mi",
    node: "minikube",
    ip: "172.17.0.8",
    containers: [{ name: "redis", image: "redis:7.2-alpine", ready: true, restartCount: 2, state: "running" }],
    labels: { app: "redis", role: "master", "statefulset.kubernetes.io/pod-name": "redis-master-0" }
  },
  {
    name: "postgres-statefulset-0",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "3d",
    cpu: "100m",
    memory: "512Mi",
    node: "minikube",
    ip: "172.17.0.9",
    containers: [{ name: "postgres", image: "postgres:16.1-alpine", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "postgres", "statefulset.kubernetes.io/pod-name": "postgres-statefulset-0" }
  },
  {
    name: "frontend-app-6c9f4d8b7-qwer1",
    namespace: "default",
    status: "Running",
    ready: "2/2",
    restarts: 0,
    age: "1d",
    cpu: "25m",
    memory: "192Mi",
    node: "minikube",
    ip: "172.17.0.10",
    containers: [
      { name: "frontend", image: "myapp/frontend:v2.1.0", ready: true, restartCount: 0, state: "running" },
      { name: "nginx-sidecar", image: "nginx:alpine", ready: true, restartCount: 0, state: "running" }
    ],
    labels: { app: "frontend", version: "v2.1.0" }
  },
  {
    name: "frontend-app-6c9f4d8b7-asdf2",
    namespace: "default",
    status: "Running",
    ready: "2/2",
    restarts: 0,
    age: "1d",
    cpu: "28m",
    memory: "198Mi",
    node: "minikube",
    ip: "172.17.0.11",
    containers: [
      { name: "frontend", image: "myapp/frontend:v2.1.0", ready: true, restartCount: 0, state: "running" },
      { name: "nginx-sidecar", image: "nginx:alpine", ready: true, restartCount: 0, state: "running" }
    ],
    labels: { app: "frontend", version: "v2.1.0" }
  },
  {
    name: "backend-api-5f8d9c7e6-zxcv1",
    namespace: "default",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "1d",
    cpu: "45m",
    memory: "320Mi",
    node: "minikube",
    ip: "172.17.0.12",
    containers: [{ name: "api", image: "myapp/backend:v1.8.3", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "backend-api", version: "v1.8.3" }
  },
  {
    name: "backend-api-5f8d9c7e6-bnm12",
    namespace: "default",
    status: "Pending",
    ready: "0/1",
    restarts: 0,
    age: "5m",
    cpu: "-",
    memory: "-",
    node: "-",
    ip: "-",
    containers: [{ name: "api", image: "myapp/backend:v1.8.3", ready: false, restartCount: 0, state: "waiting" }],
    labels: { app: "backend-api", version: "v1.8.3" }
  },
  {
    name: "worker-job-8h7g6-qwerty",
    namespace: "default",
    status: "CrashLoopBackOff",
    ready: "0/1",
    restarts: 15,
    age: "1h",
    cpu: "5m",
    memory: "64Mi",
    node: "minikube",
    ip: "172.17.0.13",
    containers: [{ name: "worker", image: "myapp/worker:v1.0.0", ready: false, restartCount: 15, state: "waiting" }],
    labels: { app: "worker", "job-name": "worker-job" }
  },
  {
    name: "batch-processor-xyz99",
    namespace: "default",
    status: "Succeeded",
    ready: "0/1",
    restarts: 0,
    age: "30m",
    cpu: "0m",
    memory: "0Mi",
    node: "minikube",
    ip: "172.17.0.14",
    containers: [{ name: "batch", image: "myapp/batch:v1.2.0", ready: false, restartCount: 0, state: "terminated" }],
    labels: { app: "batch-processor" }
  },
  {
    name: "image-puller-failed-abc",
    namespace: "default",
    status: "ImagePullBackOff",
    ready: "0/1",
    restarts: 0,
    age: "15m",
    cpu: "-",
    memory: "-",
    node: "minikube",
    ip: "172.17.0.15",
    containers: [{ name: "app", image: "private-registry.io/app:v1.0.0", ready: false, restartCount: 0, state: "waiting" }],
    labels: { app: "image-puller" }
  },
  // kube-system namespace
  {
    name: "coredns-5d78c9869d-abc11",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "15m",
    memory: "96Mi",
    node: "minikube",
    ip: "172.17.0.2",
    containers: [{ name: "coredns", image: "registry.k8s.io/coredns/coredns:v1.11.1", ready: true, restartCount: 0, state: "running" }],
    labels: { "k8s-app": "kube-dns" }
  },
  {
    name: "etcd-minikube",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "35m",
    memory: "78Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "etcd", image: "registry.k8s.io/etcd:3.5.10-0", ready: true, restartCount: 0, state: "running" }],
    labels: { component: "etcd", tier: "control-plane" }
  },
  {
    name: "kube-apiserver-minikube",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "95m",
    memory: "280Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "kube-apiserver", image: "registry.k8s.io/kube-apiserver:v1.28.3", ready: true, restartCount: 0, state: "running" }],
    labels: { component: "kube-apiserver", tier: "control-plane" }
  },
  {
    name: "kube-controller-manager-minikube",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "45m",
    memory: "64Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "kube-controller-manager", image: "registry.k8s.io/kube-controller-manager:v1.28.3", ready: true, restartCount: 0, state: "running" }],
    labels: { component: "kube-controller-manager", tier: "control-plane" }
  },
  {
    name: "kube-proxy-abc12",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "8m",
    memory: "32Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "kube-proxy", image: "registry.k8s.io/kube-proxy:v1.28.3", ready: true, restartCount: 0, state: "running" }],
    labels: { "k8s-app": "kube-proxy" }
  },
  {
    name: "kube-scheduler-minikube",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "10d",
    cpu: "12m",
    memory: "24Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "kube-scheduler", image: "registry.k8s.io/kube-scheduler:v1.28.3", ready: true, restartCount: 0, state: "running" }],
    labels: { component: "kube-scheduler", tier: "control-plane" }
  },
  {
    name: "storage-provisioner",
    namespace: "kube-system",
    status: "Running",
    ready: "1/1",
    restarts: 1,
    age: "10d",
    cpu: "5m",
    memory: "48Mi",
    node: "minikube",
    ip: "172.17.0.3",
    containers: [{ name: "storage-provisioner", image: "gcr.io/k8s-minikube/storage-provisioner:v5", ready: true, restartCount: 1, state: "running" }],
    labels: { "addonmanager.kubernetes.io/mode": "Reconcile", integration: "storage" }
  },
  // monitoring namespace
  {
    name: "prometheus-server-0",
    namespace: "monitoring",
    status: "Running",
    ready: "2/2",
    restarts: 0,
    age: "5d",
    cpu: "120m",
    memory: "450Mi",
    node: "minikube",
    ip: "172.17.0.20",
    containers: [
      { name: "prometheus", image: "prom/prometheus:v2.48.0", ready: true, restartCount: 0, state: "running" },
      { name: "configmap-reload", image: "jimmidyson/configmap-reload:v0.9.0", ready: true, restartCount: 0, state: "running" }
    ],
    labels: { app: "prometheus", component: "server" }
  },
  {
    name: "grafana-6f8b9c7d5-xyz12",
    namespace: "monitoring",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "5d",
    cpu: "35m",
    memory: "180Mi",
    node: "minikube",
    ip: "172.17.0.21",
    containers: [{ name: "grafana", image: "grafana/grafana:10.2.2", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "grafana" }
  },
  {
    name: "alertmanager-0",
    namespace: "monitoring",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "5d",
    cpu: "8m",
    memory: "32Mi",
    node: "minikube",
    ip: "172.17.0.22",
    containers: [{ name: "alertmanager", image: "prom/alertmanager:v0.26.0", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "alertmanager" }
  },
  {
    name: "node-exporter-abc",
    namespace: "monitoring",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "5d",
    cpu: "15m",
    memory: "24Mi",
    node: "minikube",
    ip: "192.168.49.2",
    containers: [{ name: "node-exporter", image: "prom/node-exporter:v1.7.0", ready: true, restartCount: 0, state: "running" }],
    labels: { app: "node-exporter" }
  },
  // ingress-nginx namespace
  {
    name: "ingress-nginx-controller-abc12",
    namespace: "ingress-nginx",
    status: "Running",
    ready: "1/1",
    restarts: 0,
    age: "7d",
    cpu: "25m",
    memory: "128Mi",
    node: "minikube",
    ip: "172.17.0.30",
    containers: [{ name: "controller", image: "registry.k8s.io/ingress-nginx/controller:v1.9.4", ready: true, restartCount: 0, state: "running" }],
    labels: { "app.kubernetes.io/name": "ingress-nginx", "app.kubernetes.io/component": "controller" }
  },
  {
    name: "ingress-nginx-admission-create-xyz",
    namespace: "ingress-nginx",
    status: "Succeeded",
    ready: "0/1",
    restarts: 0,
    age: "7d",
    cpu: "0m",
    memory: "0Mi",
    node: "minikube",
    ip: "172.17.0.31",
    containers: [{ name: "create", image: "registry.k8s.io/ingress-nginx/kube-webhook-certgen:v20231011-8b53cabe0", ready: false, restartCount: 0, state: "terminated" }],
    labels: { "app.kubernetes.io/name": "ingress-nginx", "app.kubernetes.io/component": "admission-webhook" }
  },
]

export const deployments: Deployment[] = [
  { name: "nginx-deployment", namespace: "default", replicas: "3/3", availableReplicas: 3, readyReplicas: 3, desiredReplicas: 3, image: "nginx:1.25.3", age: "2d", strategy: "RollingUpdate", labels: { app: "nginx" } },
  { name: "frontend-app", namespace: "default", replicas: "2/2", availableReplicas: 2, readyReplicas: 2, desiredReplicas: 2, image: "myapp/frontend:v2.1.0", age: "1d", strategy: "RollingUpdate", labels: { app: "frontend" } },
  { name: "backend-api", namespace: "default", replicas: "1/2", availableReplicas: 1, readyReplicas: 1, desiredReplicas: 2, image: "myapp/backend:v1.8.3", age: "1d", strategy: "RollingUpdate", labels: { app: "backend-api" } },
  { name: "coredns", namespace: "kube-system", replicas: "1/1", availableReplicas: 1, readyReplicas: 1, desiredReplicas: 1, image: "registry.k8s.io/coredns/coredns:v1.11.1", age: "10d", strategy: "RollingUpdate", labels: { "k8s-app": "kube-dns" } },
  { name: "grafana", namespace: "monitoring", replicas: "1/1", availableReplicas: 1, readyReplicas: 1, desiredReplicas: 1, image: "grafana/grafana:10.2.2", age: "5d", strategy: "RollingUpdate", labels: { app: "grafana" } },
  { name: "ingress-nginx-controller", namespace: "ingress-nginx", replicas: "1/1", availableReplicas: 1, readyReplicas: 1, desiredReplicas: 1, image: "registry.k8s.io/ingress-nginx/controller:v1.9.4", age: "7d", strategy: "RollingUpdate", labels: { "app.kubernetes.io/name": "ingress-nginx" } },
]

export const services: Service[] = [
  { name: "kubernetes", namespace: "default", type: "ClusterIP", clusterIP: "10.96.0.1", ports: "443/TCP", selector: {}, age: "10d" },
  { name: "nginx-service", namespace: "default", type: "NodePort", clusterIP: "10.96.45.123", ports: "80:30080/TCP", selector: { app: "nginx" }, age: "2d" },
  { name: "redis-service", namespace: "default", type: "ClusterIP", clusterIP: "10.96.78.45", ports: "6379/TCP", selector: { app: "redis" }, age: "5d" },
  { name: "postgres-service", namespace: "default", type: "ClusterIP", clusterIP: "10.96.90.12", ports: "5432/TCP", selector: { app: "postgres" }, age: "3d" },
  { name: "frontend-service", namespace: "default", type: "LoadBalancer", clusterIP: "10.96.12.34", externalIP: "192.168.49.100", ports: "3000:31000/TCP", selector: { app: "frontend" }, age: "1d" },
  { name: "backend-api-service", namespace: "default", type: "ClusterIP", clusterIP: "10.96.55.67", ports: "8080/TCP", selector: { app: "backend-api" }, age: "1d" },
  { name: "kube-dns", namespace: "kube-system", type: "ClusterIP", clusterIP: "10.96.0.10", ports: "53/UDP,53/TCP,9153/TCP", selector: { "k8s-app": "kube-dns" }, age: "10d" },
  { name: "prometheus-server", namespace: "monitoring", type: "ClusterIP", clusterIP: "10.96.100.10", ports: "9090/TCP", selector: { app: "prometheus" }, age: "5d" },
  { name: "grafana", namespace: "monitoring", type: "NodePort", clusterIP: "10.96.100.20", ports: "3000:32000/TCP", selector: { app: "grafana" }, age: "5d" },
  { name: "alertmanager", namespace: "monitoring", type: "ClusterIP", clusterIP: "10.96.100.30", ports: "9093/TCP", selector: { app: "alertmanager" }, age: "5d" },
  { name: "ingress-nginx-controller", namespace: "ingress-nginx", type: "NodePort", clusterIP: "10.96.200.10", ports: "80:30080/TCP,443:30443/TCP", selector: { "app.kubernetes.io/name": "ingress-nginx" }, age: "7d" },
  { name: "ingress-nginx-controller-admission", namespace: "ingress-nginx", type: "ClusterIP", clusterIP: "10.96.200.11", ports: "443/TCP", selector: { "app.kubernetes.io/name": "ingress-nginx" }, age: "7d" },
]

export const nodes: Node[] = [
  {
    name: "minikube",
    status: "Ready",
    roles: ["control-plane"],
    version: "v1.28.3",
    os: "Ubuntu 22.04.3 LTS",
    kernel: "5.15.0-91-generic",
    containerRuntime: "docker://24.0.7",
    cpu: { capacity: "4", allocatable: "4", used: "1.2" },
    memory: { capacity: "8Gi", allocatable: "7.6Gi", used: "5.8Gi" },
    pods: { capacity: 110, allocatable: 110, used: 24 },
    age: "10d",
    conditions: [
      { type: "MemoryPressure", status: "False", message: "kubelet has sufficient memory available" },
      { type: "DiskPressure", status: "False", message: "kubelet has no disk pressure" },
      { type: "PIDPressure", status: "False", message: "kubelet has sufficient PID available" },
      { type: "Ready", status: "True", message: "kubelet is posting ready status" },
    ]
  }
]

export const pvcs: PersistentVolumeClaim[] = [
  { name: "redis-data-redis-master-0", namespace: "default", status: "Bound", volume: "pvc-abc123", capacity: "1Gi", accessModes: ["ReadWriteOnce"], storageClass: "standard", age: "5d" },
  { name: "postgres-data-postgres-statefulset-0", namespace: "default", status: "Bound", volume: "pvc-def456", capacity: "10Gi", accessModes: ["ReadWriteOnce"], storageClass: "standard", age: "3d" },
  { name: "prometheus-data-prometheus-server-0", namespace: "monitoring", status: "Bound", volume: "pvc-ghi789", capacity: "8Gi", accessModes: ["ReadWriteOnce"], storageClass: "standard", age: "5d" },
  { name: "grafana-data", namespace: "monitoring", status: "Bound", volume: "pvc-jkl012", capacity: "2Gi", accessModes: ["ReadWriteOnce"], storageClass: "standard", age: "5d" },
  { name: "pending-pvc", namespace: "default", status: "Pending", volume: "-", capacity: "5Gi", accessModes: ["ReadWriteMany"], storageClass: "nfs", age: "1h" },
]

export const configMaps: ConfigMap[] = [
  { name: "kube-root-ca.crt", namespace: "default", data: { "ca.crt": "-----BEGIN CERTIFICATE-----..." }, age: "10d" },
  { name: "nginx-config", namespace: "default", data: { "nginx.conf": "events {...}", "mime.types": "..." }, age: "2d" },
  { name: "frontend-config", namespace: "default", data: { "config.json": '{"apiUrl": "...", "features": {...}}' }, age: "1d" },
  { name: "coredns", namespace: "kube-system", data: { "Corefile": ".:53 {...}" }, age: "10d" },
  { name: "prometheus-config", namespace: "monitoring", data: { "prometheus.yml": "global:...", "alerts.yml": "groups:..." }, age: "5d" },
  { name: "grafana-dashboards", namespace: "monitoring", data: { "kubernetes.json": "...", "nginx.json": "..." }, age: "5d" },
]

export const secrets: Secret[] = [
  { name: "default-token-abc", namespace: "default", type: "kubernetes.io/service-account-token", dataKeys: ["ca.crt", "namespace", "token"], age: "10d" },
  { name: "postgres-credentials", namespace: "default", type: "Opaque", dataKeys: ["username", "password", "database"], age: "3d" },
  { name: "redis-password", namespace: "default", type: "Opaque", dataKeys: ["password"], age: "5d" },
  { name: "tls-secret", namespace: "default", type: "kubernetes.io/tls", dataKeys: ["tls.crt", "tls.key"], age: "2d" },
  { name: "docker-registry", namespace: "default", type: "kubernetes.io/dockerconfigjson", dataKeys: [".dockerconfigjson"], age: "1d" },
  { name: "grafana-admin", namespace: "monitoring", type: "Opaque", dataKeys: ["admin-user", "admin-password"], age: "5d" },
]

export const events: Event[] = [
  { type: "Normal", reason: "Scheduled", message: "Successfully assigned default/nginx-deployment-7c8f95c8b9-x2k4l to minikube", object: "Pod/nginx-deployment-7c8f95c8b9-x2k4l", namespace: "default", count: 1, firstSeen: "2d", lastSeen: "2d" },
  { type: "Normal", reason: "Pulled", message: "Container image \"nginx:1.25.3\" already present on machine", object: "Pod/nginx-deployment-7c8f95c8b9-x2k4l", namespace: "default", count: 1, firstSeen: "2d", lastSeen: "2d" },
  { type: "Normal", reason: "Created", message: "Created container nginx", object: "Pod/nginx-deployment-7c8f95c8b9-x2k4l", namespace: "default", count: 1, firstSeen: "2d", lastSeen: "2d" },
  { type: "Normal", reason: "Started", message: "Started container nginx", object: "Pod/nginx-deployment-7c8f95c8b9-x2k4l", namespace: "default", count: 1, firstSeen: "2d", lastSeen: "2d" },
  { type: "Warning", reason: "BackOff", message: "Back-off restarting failed container worker in pod worker-job-8h7g6-qwerty", object: "Pod/worker-job-8h7g6-qwerty", namespace: "default", count: 15, firstSeen: "1h", lastSeen: "2m" },
  { type: "Warning", reason: "FailedScheduling", message: "0/1 nodes are available: 1 Insufficient cpu. preemption: 0/1 nodes are available: 1 No preemption victims found for incoming pod.", object: "Pod/backend-api-5f8d9c7e6-bnm12", namespace: "default", count: 8, firstSeen: "5m", lastSeen: "30s" },
  { type: "Warning", reason: "Failed", message: "Failed to pull image \"private-registry.io/app:v1.0.0\": rpc error: code = Unknown desc = Error response from daemon: pull access denied", object: "Pod/image-puller-failed-abc", namespace: "default", count: 5, firstSeen: "15m", lastSeen: "1m" },
  { type: "Normal", reason: "ScalingReplicaSet", message: "Scaled up replica set backend-api-5f8d9c7e6 to 2", object: "Deployment/backend-api", namespace: "default", count: 1, firstSeen: "5m", lastSeen: "5m" },
  { type: "Normal", reason: "SuccessfulCreate", message: "Created pod: prometheus-server-0", object: "StatefulSet/prometheus-server", namespace: "monitoring", count: 1, firstSeen: "5d", lastSeen: "5d" },
  { type: "Normal", reason: "LeaderElection", message: "minikube became leader", object: "Lease/kube-controller-manager", namespace: "kube-system", count: 1, firstSeen: "10d", lastSeen: "10d" },
]

export const ingresses: Ingress[] = [
  { name: "frontend-ingress", namespace: "default", hosts: ["frontend.local", "www.frontend.local"], address: "192.168.49.2", ports: "80, 443", age: "1d" },
  { name: "api-ingress", namespace: "default", hosts: ["api.local"], address: "192.168.49.2", ports: "80, 443", age: "1d" },
  { name: "grafana-ingress", namespace: "monitoring", hosts: ["grafana.local"], address: "192.168.49.2", ports: "80", age: "5d" },
]

export const statefulSets: StatefulSet[] = [
  { name: "redis-master", namespace: "default", ready: "1/1", age: "5d", image: "redis:7.2-alpine" },
  { name: "postgres-statefulset", namespace: "default", ready: "1/1", age: "3d", image: "postgres:16.1-alpine" },
  { name: "prometheus-server", namespace: "monitoring", ready: "1/1", age: "5d", image: "prom/prometheus:v2.48.0" },
  { name: "alertmanager", namespace: "monitoring", ready: "1/1", age: "5d", image: "prom/alertmanager:v0.26.0" },
]

export const daemonSets: DaemonSet[] = [
  { name: "kube-proxy", namespace: "kube-system", desired: 1, current: 1, ready: 1, available: 1, age: "10d" },
  { name: "node-exporter", namespace: "monitoring", desired: 1, current: 1, ready: 1, available: 1, age: "5d" },
]

export const jobs: Job[] = [
  { name: "batch-processor", namespace: "default", completions: "1/1", duration: "45s", age: "30m", status: "Complete" },
  { name: "worker-job", namespace: "default", completions: "0/1", duration: "1h", age: "1h", status: "Failed" },
  { name: "ingress-nginx-admission-create", namespace: "ingress-nginx", completions: "1/1", duration: "3s", age: "7d", status: "Complete" },
  { name: "ingress-nginx-admission-patch", namespace: "ingress-nginx", completions: "1/1", duration: "2s", age: "7d", status: "Complete" },
]

export const cronJobs: CronJob[] = [
  { name: "backup-job", namespace: "default", schedule: "0 2 * * *", suspend: false, active: 0, lastSchedule: "22h", age: "3d" },
  { name: "cleanup-job", namespace: "default", schedule: "0 */6 * * *", suspend: false, active: 0, lastSchedule: "4h", age: "5d" },
  { name: "report-generator", namespace: "monitoring", schedule: "0 8 * * 1", suspend: true, active: 0, lastSchedule: "6d", age: "7d" },
]

export const serviceAccounts: ServiceAccount[] = [
  { name: "default", namespace: "default", secrets: 1, age: "10d" },
  { name: "default", namespace: "kube-system", secrets: 1, age: "10d" },
  { name: "default", namespace: "monitoring", secrets: 1, age: "5d" },
  { name: "coredns", namespace: "kube-system", secrets: 1, age: "10d" },
  { name: "kube-proxy", namespace: "kube-system", secrets: 1, age: "10d" },
  { name: "prometheus", namespace: "monitoring", secrets: 2, age: "5d" },
  { name: "grafana", namespace: "monitoring", secrets: 1, age: "5d" },
  { name: "ingress-nginx", namespace: "ingress-nginx", secrets: 1, age: "7d" },
  { name: "ingress-nginx-admission", namespace: "ingress-nginx", secrets: 1, age: "7d" },
]

export const storageClasses: StorageClass[] = [
  { name: "standard", provisioner: "k8s.io/minikube-hostpath", reclaimPolicy: "Delete", volumeBindingMode: "Immediate", allowVolumeExpansion: true, isDefault: true, age: "10d" },
  { name: "fast", provisioner: "k8s.io/minikube-hostpath", reclaimPolicy: "Delete", volumeBindingMode: "Immediate", allowVolumeExpansion: true, isDefault: false, age: "7d" },
  { name: "nfs", provisioner: "nfs.csi.k8s.io", reclaimPolicy: "Retain", volumeBindingMode: "WaitForFirstConsumer", allowVolumeExpansion: false, isDefault: false, age: "3d" },
]

// Custom Resource Definitions
export const customResourceDefinitions: CustomResourceDefinition[] = [
  { name: "certificates.cert-manager.io", group: "cert-manager.io", version: "v1", scope: "Namespaced", kind: "Certificate", shortNames: ["cert", "certs"], established: true, age: "30d" },
  { name: "clusterissuers.cert-manager.io", group: "cert-manager.io", version: "v1", scope: "Cluster", kind: "ClusterIssuer", shortNames: [], established: true, age: "30d" },
  { name: "issuers.cert-manager.io", group: "cert-manager.io", version: "v1", scope: "Namespaced", kind: "Issuer", shortNames: [], established: true, age: "30d" },
  { name: "virtualservices.networking.istio.io", group: "networking.istio.io", version: "v1beta1", scope: "Namespaced", kind: "VirtualService", shortNames: ["vs"], established: true, age: "25d" },
  { name: "destinationrules.networking.istio.io", group: "networking.istio.io", version: "v1beta1", scope: "Namespaced", kind: "DestinationRule", shortNames: ["dr"], established: true, age: "25d" },
  { name: "gateways.networking.istio.io", group: "networking.istio.io", version: "v1beta1", scope: "Namespaced", kind: "Gateway", shortNames: ["gw"], established: true, age: "25d" },
  { name: "kustomizations.kustomize.toolkit.fluxcd.io", group: "kustomize.toolkit.fluxcd.io", version: "v1", scope: "Namespaced", kind: "Kustomization", shortNames: ["ks"], established: true, age: "20d" },
  { name: "gitrepositories.source.toolkit.fluxcd.io", group: "source.toolkit.fluxcd.io", version: "v1", scope: "Namespaced", kind: "GitRepository", shortNames: ["gitrepo"], established: true, age: "20d" },
  { name: "helmreleases.helm.toolkit.fluxcd.io", group: "helm.toolkit.fluxcd.io", version: "v2beta1", scope: "Namespaced", kind: "HelmRelease", shortNames: ["hr"], established: true, age: "20d" },
  { name: "prometheusrules.monitoring.coreos.com", group: "monitoring.coreos.com", version: "v1", scope: "Namespaced", kind: "PrometheusRule", shortNames: ["promrule"], established: true, age: "15d" },
  { name: "servicemonitors.monitoring.coreos.com", group: "monitoring.coreos.com", version: "v1", scope: "Namespaced", kind: "ServiceMonitor", shortNames: ["smon"], established: true, age: "15d" },
  { name: "podmonitors.monitoring.coreos.com", group: "monitoring.coreos.com", version: "v1", scope: "Namespaced", kind: "PodMonitor", shortNames: ["pmon"], established: true, age: "15d" },
]

export const certificates: Certificate[] = [
  { name: "frontend-tls", namespace: "default", ready: true, secretName: "frontend-tls-secret", issuer: "letsencrypt-prod", status: "True", expiry: "89d", age: "1d" },
  { name: "api-tls", namespace: "default", ready: true, secretName: "api-tls-secret", issuer: "letsencrypt-prod", status: "True", expiry: "85d", age: "5d" },
  { name: "grafana-tls", namespace: "monitoring", ready: true, secretName: "grafana-tls-secret", issuer: "letsencrypt-staging", status: "True", expiry: "30d", age: "60d" },
  { name: "prometheus-tls", namespace: "monitoring", ready: false, secretName: "prometheus-tls-secret", issuer: "letsencrypt-prod", status: "False", expiry: "-", age: "2d" },
  { name: "ingress-wildcard", namespace: "ingress-nginx", ready: true, secretName: "wildcard-tls-secret", issuer: "letsencrypt-prod", status: "True", expiry: "75d", age: "15d" },
]

export const virtualServices: VirtualService[] = [
  { name: "frontend-vs", namespace: "default", hosts: ["frontend.example.com"], gateways: ["istio-system/main-gateway"], age: "5d" },
  { name: "api-vs", namespace: "default", hosts: ["api.example.com"], gateways: ["istio-system/main-gateway"], age: "5d" },
  { name: "grafana-vs", namespace: "monitoring", hosts: ["grafana.example.com"], gateways: ["istio-system/main-gateway"], age: "3d" },
  { name: "canary-vs", namespace: "staging", hosts: ["staging.example.com"], gateways: ["istio-system/staging-gateway"], age: "1d" },
]

export const kustomizations: Kustomization[] = [
  { name: "infrastructure", namespace: "flux-system", path: "./infrastructure", sourceRef: "flux-system/flux-system", ready: true, status: "Applied revision: main/abc123", age: "20d" },
  { name: "apps", namespace: "flux-system", path: "./apps/production", sourceRef: "flux-system/flux-system", ready: true, status: "Applied revision: main/abc123", age: "20d" },
  { name: "monitoring", namespace: "flux-system", path: "./monitoring", sourceRef: "flux-system/flux-system", ready: true, status: "Applied revision: main/def456", age: "15d" },
  { name: "staging-apps", namespace: "flux-system", path: "./apps/staging", sourceRef: "flux-system/flux-system", ready: false, status: "Reconciliation failed: timeout", age: "5d" },
]

// Utility functions
export function getPodsForNamespace(namespace: string): Pod[] {
  if (namespace === "All Namespaces") return pods
  return pods.filter(pod => pod.namespace === namespace)
}

export function getDeploymentsForNamespace(namespace: string): Deployment[] {
  if (namespace === "All Namespaces") return deployments
  return deployments.filter(dep => dep.namespace === namespace)
}

export function getServicesForNamespace(namespace: string): Service[] {
  if (namespace === "All Namespaces") return services
  return services.filter(svc => svc.namespace === namespace)
}

export function getEventsForNamespace(namespace: string): Event[] {
  if (namespace === "All Namespaces") return events
  return events.filter(event => event.namespace === namespace)
}

export function getClusterStats() {
  const totalPods = pods.length
  const runningPods = pods.filter(p => p.status === "Running").length
  const pendingPods = pods.filter(p => p.status === "Pending").length
  const failedPods = pods.filter(p => ["Failed", "CrashLoopBackOff", "ImagePullBackOff"].includes(p.status)).length

  const totalDeployments = deployments.length
  const healthyDeployments = deployments.filter(d => d.availableReplicas === d.desiredReplicas).length

  const totalServices = services.length
  const totalPVCs = pvcs.length
  const boundPVCs = pvcs.filter(p => p.status === "Bound").length
  const pendingPVCs = pvcs.filter(p => p.status === "Pending").length

  return {
    pods: { total: totalPods, running: runningPods, pending: pendingPods, failed: failedPods },
    deployments: { total: totalDeployments, healthy: healthyDeployments },
    services: { total: totalServices },
    pvcs: { total: totalPVCs, bound: boundPVCs, pending: pendingPVCs },
    namespaces: namespaces.length,
    nodes: nodes.length,
  }
}

export function getCpuUsageHistory() {
  return [
    { time: "00:00", value: 25 },
    { time: "02:00", value: 28 },
    { time: "04:00", value: 30 },
    { time: "06:00", value: 35 },
    { time: "08:00", value: 45 },
    { time: "10:00", value: 55 },
    { time: "12:00", value: 65 },
    { time: "14:00", value: 60 },
    { time: "16:00", value: 55 },
    { time: "18:00", value: 45 },
    { time: "20:00", value: 40 },
    { time: "22:00", value: 32 },
    { time: "Now", value: 35 },
  ]
}

export function getMemoryUsageHistory() {
  return [
    { time: "00:00", value: 60 },
    { time: "02:00", value: 58 },
    { time: "04:00", value: 58 },
    { time: "06:00", value: 62 },
    { time: "08:00", value: 65 },
    { time: "10:00", value: 70 },
    { time: "12:00", value: 72 },
    { time: "14:00", value: 74 },
    { time: "16:00", value: 75 },
    { time: "18:00", value: 73 },
    { time: "20:00", value: 70 },
    { time: "22:00", value: 68 },
    { time: "Now", value: 72 },
  ]
}

export function getNamespaceDistribution() {
  return namespaces
    .filter(ns => ns.podCount > 0)
    .map((ns, index) => ({
      name: ns.name,
      value: ns.podCount,
      color: ["var(--chart-4)", "var(--chart-2)", "var(--chart-1)", "var(--chart-3)", "var(--chart-5)"][index % 5]
    }))
}
