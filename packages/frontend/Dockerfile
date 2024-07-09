ARG PERL_VERSION=5.38.2
ARG DEBIAN_VERSION=12
ARG DEBIAN_CODENAME=bookworm

# builder ####################################################################
FROM perl:$PERL_VERSION AS builder

WORKDIR .

ENV LANG C.UTF-8

RUN set -ex \
    && sed -i -- 's/Types: deb/Types: deb deb-src/g' /etc/apt/sources.list.d/debian.sources \
    && apt-get update \
    && apt-get dist-upgrade -y \
    && apt-get install -y --no-install-recommends \
               build-essential \
    && apt-get build-dep -y ikiwiki

COPY . .

RUN cpanm --installdeps --verbose -n .

RUN git clone https://github.com/lschierer/ikiwiki.git ikiwiki

RUN cd ikiwiki \
  && PERL5LIB=`pwd` PERL_MM_USE_DEFAULT=1 perl -MCPAN -e 'CPAN::Shell->install("Bundle::IkiWiki")' \
  && PERL5LIB=`pwd` PERL_MM_USE_DEFAULT=1 perl -MCPAN -e 'CPAN::Shell->install("Bundle::IkiWiki::Extras")' \

WORKDIR /usr/src/evony_t_k_r_tips/ikiwiki
RUN perl Makefile.PL \
    && make
RUN make pure_install

# Runner ####################################################################
FROM perl:$PERL_VERSION
ENV LANG C.UTF-8

WORKDIR /opt/evony_t_k_r_tips

RUN apt update \
    && apt dist-upgrade -y --no-install-recommends

COPY . .

COPY --from=builder /usr/local /usr/local

EXPOSE 3000
CMD ./script/evony_tkrtips prefork
