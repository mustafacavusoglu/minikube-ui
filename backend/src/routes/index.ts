import { Router } from 'express'
import namespacesRouter from './namespaces'
import podsRouter from './pods'
import deploymentsRouter from './deployments'
import replicaSetsRouter from './replicasets'
import statefulSetsRouter from './statefulsets'
import daemonSetsRouter from './daemonsets'
import jobsRouter from './jobs'
import cronJobsRouter from './cronjobs'
import servicesRouter from './services'
import ingressesRouter from './ingresses'
import pvcsRouter from './pvcs'
import storageClassesRouter from './storageclasses'
import configMapsRouter from './configmaps'
import secretsRouter from './secrets'
import nodesRouter from './nodes'
import serviceAccountsRouter from './serviceaccounts'
import crdsRouter from './crds'
import customResourcesRouter from './custom-resources'
import eventsRouter from './events'
import metricsRouter from './metrics'
import yamlRouter from './yaml'
import aboutRouter from './about'

const router = Router()

router.use('/namespaces', namespacesRouter)
router.use('/', podsRouter)
router.use('/', deploymentsRouter)
router.use('/', replicaSetsRouter)
router.use('/', statefulSetsRouter)
router.use('/', daemonSetsRouter)
router.use('/', jobsRouter)
router.use('/', cronJobsRouter)
router.use('/', servicesRouter)
router.use('/', ingressesRouter)
router.use('/', pvcsRouter)
router.use('/storageclasses', storageClassesRouter)
router.use('/', configMapsRouter)
router.use('/', secretsRouter)
router.use('/nodes', nodesRouter)
router.use('/', serviceAccountsRouter)
router.use('/crds', crdsRouter)
router.use('/', customResourcesRouter)
router.use('/', eventsRouter)
router.use('/cluster', metricsRouter)
router.use('/', yamlRouter)
router.use('/about', aboutRouter)

export default router
