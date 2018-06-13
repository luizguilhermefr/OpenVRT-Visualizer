<template>
    <md-card class="md-elevation-0">
        <md-card-header>
            <div class="md-title">OpenVRT Visualizer {{version}}</div>
        </md-card-header>

        <md-card-content>
            <p>OpenVRT Visualizer is an open source software that allows visualization and analysis of variable rate
                technology prescription maps.</p>

            <p>Developed by Luiz Guilherme Fonseca Rosa (luizguilhermefr@gmail.com) as part of a thesis for Computer
                Science bachelor degree, oriented by Marcio Seiji Oyamada (marcio.oyamada@unioeste.br).</p>

            <p>Special thanks to Rogerio Schneider from Agromatic Automação e Controle.</p>

            <p>Cascavel, Paraná, Brazil, 2018</p>
        </md-card-content>

        <md-card-actions>
            <md-button class="md-icon-button md-raised" v-on:click="openGithub">
                <md-icon md-src="../static/github.svg"/>
            </md-button>
        </md-card-actions>
    </md-card>
</template>

<script>
  import { shell } from 'electron'

  export default {
    name: 'about',
    data () {
      return {
        version: '0.1.0',
        githubURL: 'https://github.com/luizguilhermefr/OpenVRT-Visualizer',
      }
    },
    methods: {
      openGithub () {
        shell.openExternal(this.githubURL)
      },
    },
  }
</script>
