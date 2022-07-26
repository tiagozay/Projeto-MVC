class NegociacaoService{

    constructor()
    {
        this._http = new HttpService();
    }

    obterNegociacoes()
    {
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            return periodos.reduce((acumulador, periodo) =>
                acumulador.concat(periodo)
            , [])

        }).catch( () => {throw new Error(erro)});
    }


    obterNegociacoesDaSemana()
    {

        return this._http.get('negociacoes/semana')
        .then( negociacoes => {
            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch( erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana!');
        }) 

    }

    obterNegociacoesDaSemanaAnterior()
    {
        return this._http.get('negociacoes/anterior')
        .then( negociacoes => {
            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch( erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana anterior!');
        }) 

    }

    obterNegociacoesDaSemanaRetrasada()
    {
        return this._http.get('negociacoes/retrasada')
        .then( negociacoes => {
            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor));
        }).catch( erro => {
            console.log(erro);
            throw new Error('Não foi possível obter as negociações da semana retrasada!');
        }) 
    }

    cadastra(negociacao)
    {
        return ConnectionFactory
            .getConnection()
            .then( connection => new NegociacaoDao(connection) )
            .then( dao => dao.adiciona(negociacao) )
            .then( () => "Negociação adicionada com sucesso!" )
            .catch( erro => {
                console.log(erro);
                throw new Error("Não foi possível adicionar a negociação!") 
            });

    }

    lista()
    {
        
        return ConnectionFactory
            .getConnection()
            .then( connection => new NegociacaoDao(connection) )
            .then( dao => dao.listaTodos() )
            .catch( erro => {
                console.log(erro);
                throw new Error("Não foi possível obter as negociações!");
            })
    }

    apaga()
    {
        return ConnectionFactory
            .getConnection()
            .then( connection => new NegociacaoDao(connection) )
            .then( dao => dao.apagaTodos() )
            .then( () => "Negociações apagadas com sucesso!" )
            .catch( erro => {
                console.log(erro);
                throw new Error("Não foi possível apagar as negociações!");
            } )
        
    }

    importa(listaAtual)
    {
        return this.obterNegociacoes()
        .then( negociacoes => 
            negociacoes.filter( negociacao => 
                !listaAtual.negociacoes
                .some( negociacaoExistente => 
                    negociacao.isEquals(negociacaoExistente)
                )
            ) 
        )
        .catch( erro => {
            console.log(erro);
            throw new Error("Não foi possível buscar negociações para importar!");
        } )

    }
}